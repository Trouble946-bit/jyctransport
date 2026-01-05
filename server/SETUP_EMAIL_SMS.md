# Email & SMS Setup Guide for JYC Contact Form

## Quick Start

1. Install dependencies:
```powershell
npm install
```

2. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

3. Configure your credentials (see sections below)

4. Start the server:
```powershell
npm start
```

---

## Email Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** and **Windows Computer**
3. Copy the generated 16-character password

### Step 3: Update .env
Open `.env` and add:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
NOTIFICATION_EMAIL=your-gmail@gmail.com
```

---

## SMS Setup (Twilio) - OPTIONAL

### Step 1: Create Twilio Account
1. Sign up at https://www.twilio.com/
2. Verify your phone number
3. Go to Console Dashboard

### Step 2: Get Your Credentials
- **Account SID**: Found in the dashboard
- **Auth Token**: Found in the dashboard
- **Phone Number**: Get a Twilio phone number (or verify your own)

### Step 3: Update .env
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

---

## How It Works

When someone submits the contact form:

1. **Saved to Database**: Contact details are saved to `contacts.json`
2. **Email Notification**: You receive an email with the form details
3. **SMS Notification** (optional): If Twilio is configured, an SMS is sent to the phone number

---

## Troubleshooting

**Email not sending?**
- Check that EMAIL_USER and EMAIL_PASSWORD are correct
- Verify 2-Factor Authentication is enabled
- Use an **App Password** (not your regular Gmail password)
- Check server logs for errors

**SMS not sending?**
- Verify Twilio credentials are correct
- Ensure phone number is in E.164 format: +1234567890
- Check that Twilio account has credits

**Server won't start?**
- Run `npm install` again to ensure all packages are installed
- Check that port 3000 is not in use
- Look for error messages in the terminal

---

## Files Structure

```
website/server/
├── server.js          # Main server with email/SMS logic
├── package.json       # Dependencies
├── .env              # Your credentials (DO NOT SHARE)
├── .env.example      # Template for .env
├── contacts.json     # Saved contact submissions
└── README.md
```

---

## Security Notes

- **Never commit `.env` to Git** — it contains sensitive credentials
- Add `.env` to `.gitignore` if using version control
- Use strong passwords for email accounts
- Regenerate Twilio tokens if they're exposed
