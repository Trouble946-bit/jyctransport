const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
  }

  const { name, email, phone, message } = payload || {};
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing required fields' }) };
  }

  // Email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
    secure: (process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: process.env.EMAIL_TLS_STRICT === 'true' }
  });

  // Send email (non-blocking failures handled)
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${(message||'').replace(/\n/g,'<br>')}</p>`
    });
    console.log('Email sent');
  } catch (err) {
    console.error('Email send failed', err && err.message);
  }

  // Optional: Twilio SMS
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && phone) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `JYC inquiry from ${name}: ${(message||'').substring(0,120)}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      console.log('SMS sent');
    } catch (err) {
      console.error('SMS send failed', err && err.message);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Thanks — we received your message. We'll get back to you soon!" })
  };
};
