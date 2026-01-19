# Server Maintenance Guide for JYC Transport Website

## Overview

This guide explains how to maintain and deploy the JYC Transport website on different server environments. The website is a simple static site with a contact form that can be deployed in multiple ways.

## Current Deployment Status

The website is currently deployed on **GitHub Pages** using Formspree for contact form handling.

## Deployment Options

### 1. GitHub Pages (Current Setup)
- **Status**: Active
- **Contact Form**: Uses Formspree (https://formspree.io/f/xzdznkjl)
- **Deployment**: Automatic via GitHub Actions on push to master branch
- **No server maintenance required** - handled by GitHub

### 2. Custom Web Server (Node.js/Express)

If you want to deploy on your own server with full control:

#### Requirements:
- Linux/Windows server with Node.js installed (v14 or higher)
- SSH access to the server
- Domain name (optional but recommended)
- Email account for notifications (Gmail recommended)

#### Server Access Needed:
- SSH credentials (username, password/SSH key, IP address/hostname)
- Server port availability (default: 3000 or 80/443 for production)
- Firewall configuration access
- Process manager setup (PM2 recommended)

#### Deployment Steps:

1. **Connect to Server**:
   ```bash
   ssh username@your-server-ip
   ```

2. **Install Dependencies**:
   ```bash
   # Install Node.js if not present
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

3. **Clone Repository**:
   ```bash
   cd /var/www
   git clone https://github.com/Trouble946-bit/jyctransport.git
   cd jyctransport/server
   ```

4. **Configure Environment**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Add your credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   NOTIFICATION_EMAIL=stanley.mwale600@gmail.com
   ```

5. **Install and Start**:
   ```bash
   npm install
   pm2 start server.js --name jyc-transport
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx (Optional - for production)**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### 3. Netlify Serverless

The repository includes Netlify Functions for serverless deployment:

#### Requirements:
- Netlify account (free tier available)
- Environment variables configured in Netlify dashboard

#### Deployment:
1. Connect GitHub repository to Netlify
2. Set build settings:
   - Build command: (leave empty for static site)
   - Publish directory: `/`
3. Add environment variables in Netlify dashboard:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `NOTIFICATION_EMAIL`
   - (Optional) Twilio credentials for SMS

### 4. Other Hosting Options

The website can also be deployed on:
- **Vercel**: Similar to Netlify, supports serverless functions
- **AWS S3 + Lambda**: For AWS infrastructure
- **Digital Ocean App Platform**: Simple deployment with database options
- **Heroku**: Good for Node.js applications

## What Access/Information is Needed for Server Maintenance?

To help maintain a website on a server, the following would be needed:

### Essential Access:
1. **Server Access**:
   - SSH credentials (username, password or private key)
   - Server IP address or hostname
   - Sudo/admin privileges (if configuration changes needed)

2. **Repository Access**:
   - GitHub repository access (already public)
   - Git credentials (for pulling updates)

3. **Service Credentials** (if using custom server):
   - Email service credentials (Gmail App Password)
   - Domain registrar access (if DNS changes needed)
   - SSL certificate details (if using HTTPS)

### Useful Information:
- Current server setup and configuration
- Existing services running on the server
- Backup procedures and schedules
- Monitoring tools in use
- Previous deployment documentation

## Maintenance Tasks

Regular maintenance tasks include:

1. **Updates**:
   - Pull latest code changes from GitHub
   - Update Node.js dependencies
   - Apply security patches

2. **Monitoring**:
   - Check server logs for errors
   - Monitor form submissions
   - Check email delivery
   - Monitor server resource usage

3. **Backups**:
   - Backup contact form submissions
   - Backup server configuration
   - Backup environment variables

4. **Security**:
   - Update SSL certificates
   - Review and update dependencies
   - Monitor for security vulnerabilities
   - Review server access logs

## Support Contacts

For website maintenance assistance, contact:
- **Email**: medi.fatsani@gmail.com, stanley.mwale600@gmail.com
- **Repository**: https://github.com/Trouble946-bit/jyctransport

## Next Steps

If you want to deploy on a custom server:
1. Provide server access credentials (securely - not via GitHub)
2. Specify which deployment option you prefer
3. Share any specific requirements or constraints
4. Confirm email configuration preferences

---

**Note**: This website is currently working well on GitHub Pages with Formspree. Consider whether moving to a custom server is necessary for your use case.
