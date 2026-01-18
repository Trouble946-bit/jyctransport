# Deployment Checklist for JYC Transport Website

Use this checklist when deploying or maintaining the website on a server.

## Pre-Deployment Checklist

- [ ] Confirm server access credentials are available
- [ ] Verify Node.js version (v14+ required for custom server)
- [ ] Confirm domain name (if applicable)
- [ ] Prepare email credentials for contact form
- [ ] Review current deployment method (GitHub Pages/Custom Server/Netlify)
- [ ] Backup existing website data (if updating existing deployment)

## GitHub Pages Deployment (Current Setup)

- [ ] Verify Formspree form ID is configured in `contact.html`
- [ ] Check GitHub Actions workflow is enabled
- [ ] Confirm deployment to master branch triggers automatic deployment
- [ ] Test contact form after deployment
- [ ] Verify form submissions reach the correct email addresses

**Current Formspree Configuration**:
- Form ID: `xzdznkjl`
- Recipients: stanley.mwale600@gmail.com, medi.fatsani@gmail.com, lcmwale69@gmail.com

## Custom Server Deployment

### Initial Setup

- [ ] **Connect to server**: `ssh username@server-ip`
- [ ] **Update system**: `sudo apt update && sudo apt upgrade -y`
- [ ] **Install Node.js**: 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- [ ] **Install Git**: `sudo apt install git -y`
- [ ] **Install PM2**: `sudo npm install -g pm2`
- [ ] **Install Nginx** (optional): `sudo apt install nginx -y`

### Application Setup

- [ ] **Clone repository**:
  ```bash
  cd /var/www
  sudo git clone https://github.com/Trouble946-bit/jyctransport.git
  cd jyctransport/server
  ```

- [ ] **Set permissions**:
  ```bash
  sudo chown -R $USER:$USER /var/www/jyctransport
  ```

- [ ] **Install dependencies**: `npm install`

- [ ] **Configure environment**:
  ```bash
  cp .env.example .env
  nano .env
  ```
  
  Fill in:
  - `EMAIL_USER=your-email@gmail.com`
  - `EMAIL_PASSWORD=your-app-password` (see Gmail App Password setup)
  - `NOTIFICATION_EMAIL=stanley.mwale600@gmail.com`
  - (Optional) Twilio credentials for SMS

### Gmail App Password Setup

- [ ] Go to https://myaccount.google.com/security
- [ ] Enable 2-Step Verification
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" and "Windows Computer"
- [ ] Copy generated password to `.env` file

### Start Application

- [ ] **Test server**: `npm start` (should run on http://localhost:3000)
- [ ] **Stop test**: Press `Ctrl+C`
- [ ] **Start with PM2**: `pm2 start server.js --name jyc-transport`
- [ ] **Save PM2 config**: `pm2 save`
- [ ] **Enable PM2 startup**: `pm2 startup` (run the command it outputs)
- [ ] **Check status**: `pm2 status`
- [ ] **View logs**: `pm2 logs jyc-transport`

### Configure Nginx (Production)

- [ ] **Create Nginx config**:
  ```bash
  sudo nano /etc/nginx/sites-available/jyctransport
  ```

- [ ] **Add configuration**:
  ```nginx
  server {
      listen 80;
      server_name your-domain.com www.your-domain.com;
      
      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
  }
  ```

- [ ] **Enable site**:
  ```bash
  sudo ln -s /etc/nginx/sites-available/jyctransport /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx
  ```

### SSL Certificate (HTTPS)

- [ ] **Install Certbot**: `sudo apt install certbot python3-certbot-nginx -y`
- [ ] **Get certificate**: `sudo certbot --nginx -d your-domain.com -d www.your-domain.com`
- [ ] **Test auto-renewal**: `sudo certbot renew --dry-run`

### Firewall Configuration

- [ ] **Check firewall status**: `sudo ufw status`
- [ ] **Allow HTTP**: `sudo ufw allow 80/tcp`
- [ ] **Allow HTTPS**: `sudo ufw allow 443/tcp`
- [ ] **Allow SSH**: `sudo ufw allow 22/tcp`
- [ ] **Enable firewall**: `sudo ufw enable`

## Netlify Deployment

- [ ] Create Netlify account at https://netlify.com
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build command: (leave empty)
  - Publish directory: `/`
  - Functions directory: `netlify/functions`
- [ ] Add environment variables in Netlify dashboard:
  - `EMAIL_USER`
  - `EMAIL_PASSWORD`
  - `NOTIFICATION_EMAIL`
  - (Optional) `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- [ ] Update `contact.html` to use Netlify Functions endpoint
- [ ] Deploy and test

## Post-Deployment Testing

- [ ] **Website loads correctly**: Visit homepage at your domain/URL
- [ ] **Navigation works**: Click between Home and Contact Us pages
- [ ] **Images load**: Check logo and truck images display
- [ ] **Styles applied**: Verify CSS is working
- [ ] **Contact form displays**: Check form on contact page
- [ ] **Form submission works**: Submit a test form
- [ ] **Email received**: Verify email arrives at stanley.mwale600@gmail.com
- [ ] **Success message displays**: Confirm user sees confirmation
- [ ] **Mobile responsive**: Test on mobile device or browser dev tools
- [ ] **Map loads** (if using geolocation): Check map embed on contact page

## Maintenance Tasks

### Daily
- [ ] Monitor PM2 logs: `pm2 logs jyc-transport --lines 50`
- [ ] Check form submissions in email or `contacts.json`

### Weekly
- [ ] Check server disk space: `df -h`
- [ ] Check server memory: `free -h`
- [ ] Review error logs: `pm2 logs jyc-transport --err`
- [ ] Verify SSL certificate is valid: `sudo certbot certificates`

### Monthly
- [ ] Update system packages: `sudo apt update && sudo apt upgrade -y`
- [ ] Update Node.js dependencies: `cd /var/www/jyctransport/server && npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Backup contacts database: `cp contacts.json contacts-backup-$(date +%Y%m%d).json`
- [ ] Review server access logs: `sudo tail -100 /var/log/nginx/access.log`

### As Needed
- [ ] Pull latest code changes:
  ```bash
  cd /var/www/jyctransport
  git pull origin master
  cd server
  npm install
  pm2 restart jyc-transport
  ```
- [ ] Update environment variables: Edit `.env` and restart: `pm2 restart jyc-transport`
- [ ] Rotate logs: `pm2 flush`

## Troubleshooting

### Website not loading
- [ ] Check PM2 status: `pm2 status`
- [ ] Check Nginx status: `sudo systemctl status nginx`
- [ ] Check logs: `pm2 logs jyc-transport`
- [ ] Verify port 3000 is listening: `sudo netstat -tlnp | grep 3000`

### Contact form not working
- [ ] Check `.env` file has correct email credentials
- [ ] Test email manually: `pm2 logs jyc-transport` and submit form
- [ ] Verify Gmail App Password is correct
- [ ] Check spam folder for test emails
- [ ] Verify Formspree form ID (if using GitHub Pages)

### SSL certificate issues
- [ ] Check certificate expiry: `sudo certbot certificates`
- [ ] Renew manually: `sudo certbot renew`
- [ ] Check Nginx config: `sudo nginx -t`

### Server performance issues
- [ ] Check CPU usage: `top`
- [ ] Check memory: `free -h`
- [ ] Check disk space: `df -h`
- [ ] Review PM2 metrics: `pm2 monit`

## Support and Documentation

- **Server Maintenance Guide**: See `SERVER_MAINTENANCE_GUIDE.md`
- **Formspree Setup**: See `FORMSPREE_SETUP.md`
- **Email/SMS Setup**: See `server/SETUP_EMAIL_SMS.md`
- **Server README**: See `server/README.md`

## Contact Information

For assistance:
- **Email**: medi.fatsani@gmail.com, stanley.mwale600@gmail.com
- **GitHub**: https://github.com/Trouble946-bit/jyctransport
- **Phone**: +265999920939

---

**Last Updated**: January 2026
