const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_ROOT = path.join(__dirname, '..');
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');
const NOTIFY_LOG = path.join(__dirname, 'notifications.log');

function logNotificationError(type, err) {
  try {
    const entry = `[${new Date().toISOString()}] ${type.toUpperCase()} ERROR: ${err && err.stack ? err.stack : String(err)}\n`;
    fs.appendFileSync(NOTIFY_LOG, entry, 'utf8');
  } catch (e) {
    console.error('Failed to write notification log:', e);
  }
}

// Email setup (using Gmail or SMTP)
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // In some networks a proxy replaces TLS certs; this prevents rejection.
    // For production, consider removing this and ensuring a proper CA chain.
    rejectUnauthorized: false
  }
});


// Workaround for environments that intercept TLS (e.g. corporate proxies)
// If you prefer stricter TLS checks remove the tls option below.
emailTransporter.verify().then(() => {
  console.log('Email transporter verified');
}).catch((err) => {
  console.warn('Email transporter verification failed:', err && err.message);
});

// Twilio setup (optional - for SMS)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn('Twilio not configured, SMS notifications disabled');
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(SITE_ROOT));

if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([]), 'utf8');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const record = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString()
  };

  try {
    // Save to database (JSON file)
    const raw = fs.readFileSync(CONTACTS_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.push(record);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save contact:', err);
    return res.status(500).json({ success: false, error: 'Failed to save message' });
  }

  // Send email notification (non-fatal)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    (async () => {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
          subject: `New Contact Form Submission from ${record.name}`,
          html: `
            <h2>New Message from JYC Contact Form</h2>
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Email:</strong> ${record.email}</p>
            <p><strong>Phone:</strong> ${record.phone || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${record.message.replace(/\n/g, '<br>')}</p>
            <p><strong>Received at:</strong> ${record.receivedAt}</p>
          `
        };
        await emailTransporter.sendMail(mailOptions);
        console.log('Email sent to:', process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER);
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr);
        logNotificationError('email', emailErr);
      }
    })();
  }

  // Send SMS notification (optional - for Twilio) - non-fatal
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER && record.phone) {
    (async () => {
      try {
        await twilioClient.messages.create({
          body: `New JYC Transport inquiry from ${record.name}. Message: ${record.message.substring(0, 100)}...`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: record.phone
        });
        console.log('SMS sent to:', record.phone);
      } catch (smsErr) {
        console.error('Failed to send SMS notification:', smsErr);
        logNotificationError('sms', smsErr);
      }
    })();
  }

  console.log('New contact received:', record);
  res.json({ success: true, message: "Thanks — we received your message. We'll get back to you soon!" });
});

app.listen(PORT, () => {
  console.log(`JYC server running at http://localhost:${PORT}`);
});
