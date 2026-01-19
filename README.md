JYC Mini Truck Transport — Simple 2-page website

Files:
- `index.html` — Home page
- `contact.html` — Contact page with form (POST -> /api/contact)
- `css/styles.css` — Styles
- `images/logo.svg`, `images/minivan1.svg`, `images/minivan2.svg` — Logo and placeholder van illustrations

## Current Deployment

The website is currently deployed on **GitHub Pages** at: https://trouble946-bit.github.io/jyctransport/

Contact form uses Formspree for handling submissions.

## How to preview locally

1. Start the server in `server/`:

```bash
cd server
npm install
npm start
```

2. Open `http://localhost:3000` in your browser.

## Documentation

- **[Server Maintenance Guide](SERVER_MAINTENANCE_GUIDE.md)** — Complete guide for deploying and maintaining the website on different servers
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** — Step-by-step checklist for deployment and maintenance tasks
- **[Formspree Setup](FORMSPREE_SETUP.md)** — Instructions for configuring the contact form with Formspree
- **[Email & SMS Setup](server/SETUP_EMAIL_SMS.md)** — Guide for configuring email notifications and optional SMS

## Deployment Options

This website can be deployed on:
1. **GitHub Pages** (current) - with Formspree for contact forms
2. **Custom Server** - using Node.js/Express server
3. **Netlify** - with serverless functions
4. **Other platforms** - Vercel, AWS, Digital Ocean, etc.

See [SERVER_MAINTENANCE_GUIDE.md](SERVER_MAINTENANCE_GUIDE.md) for detailed instructions.

## Notes

- Submissions from the contact form are saved to `server/contacts.json` when using the local Node.js server.
- For GitHub Pages deployment, submissions are handled by Formspree and sent via email.
- Replace placeholder SVGs with your own images if desired.
