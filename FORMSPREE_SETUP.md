# Formspree Setup Instructions

Your contact form has been configured to use Formspree (free service).

## Steps to Complete Setup:

1. **Sign up for Formspree** (free):
   - Go to: https://formspree.io/register
   - Create a free account (allows 50 submissions/month)

2. **Create a new form**:
   - After logging in, click "New Form"
   - Name it: "JYC Contact Form"
   - Set email to receive notifications: **medi.fatsani@gmail.com**

3. **Get your Form ID**:
   - Copy the form endpoint (looks like: `https://formspree.io/f/xyzabc123`)
   - The form ID is the part after `/f/` (example: `xyzabc123`)

4. **Update contact.html**:
   - Open: `contact.html`
   - Find line with: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual form ID

5. **Commit and push**:
   ```powershell
   cd 'C:\Users\Fa\Documents\Anenenji\Programming\JYC\JYC Transports\website'
   git add contact.html
   git commit -m "Update Formspree form ID"
   git push
   ```

## Formspree Features (Free Plan):
- ✅ 50 submissions per month
- ✅ Email notifications to medi.fatsani@gmail.com
- ✅ Spam filtering
- ✅ File uploads (if needed later)
- ✅ Custom "thank you" page redirect

## Alternative (No signup needed):
You can also use the legacy Formspree endpoint (no account needed):
- Change action to: `action="https://formspree.io/medi.fatsani@gmail.com"`
- But you'll need to verify email on first submission
- Limited features compared to registered account

Your form is ready to use once you update the Form ID!
