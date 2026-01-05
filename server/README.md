Node/Express server for JYC website

This simple server serves the static website (the parent folder) and provides a POST endpoint at `/api/contact` which accepts JSON or URL-encoded form data and saves submissions to `contacts.json`.

Run locally

1. Open a terminal in this folder:

```powershell
cd 'C:\Users\Fa\Documents\Anenenji\Programming\JYC\JYC Transports\website\server'
```

2. Install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm start
```

4. Open your browser to `http://localhost:3000` and test the contact form.

Notes

- Submissions are appended to `contacts.json` in this folder.
- For production use, replace file storage with a proper database or email delivery. Add validation and rate limiting as needed.
