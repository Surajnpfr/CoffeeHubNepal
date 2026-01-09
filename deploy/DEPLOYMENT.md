# Detailed Deployment Instructions for Hostinger

## Prerequisites

1. Hostinger account with:
   - Static hosting (for frontend)
   - Node.js hosting (for backend API)
2. MongoDB database (MongoDB Atlas or Azure Cosmos DB)
3. Domain name configured

## Step 1: Prepare Environment Variables

1. Copy `deploy/.env.example` to `deploy/backend/.env`
2. Fill in all required values:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/coffeehubnepal

# Security
JWT_SECRET=your_very_long_random_secret_key_here

# Application
PORT=4000
CLIENT_ORIGIN=https://yourdomain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=noreply@yourdomain.com
```

## Step 2: Deploy Frontend (Static Files)

### Method A: Using File Manager

1. Log in to Hostinger Control Panel
2. Go to **File Manager**
3. Navigate to `public_html/` (or your domain root)
4. Upload all files from `deploy/frontend/` folder
5. Ensure `.htaccess` file is uploaded (important for routing)

### Method B: Using FTP

1. Connect via FTP client (FileZilla, WinSCP, etc.)
2. Upload `deploy/frontend/` contents to `public_html/`
3. Set file permissions:
   - Folders: 755
   - Files: 644
   - `.htaccess`: 644

### Verify Frontend

- Visit `https://yourdomain.com`
- Should see the CoffeeHubNepal landing page

## Step 3: Deploy Backend API

### Using Hostinger Node.js Manager

1. Log in to Hostinger Control Panel
2. Navigate to **Node.js** section
3. Click **Create Application**
4. Configure:
   - **Application Name**: `coffeehub-api`
   - **Node.js Version**: `18.x` or `20.x`
   - **Application Root**: `/backend` (or subdomain path)
   - **Application URL**: `https://api.yourdomain.com` (or subdomain)
   - **Application Startup File**: `server.js`
5. Upload `deploy/backend/` folder contents
6. Set environment variables in Hostinger panel
7. Click **Install Dependencies** (or run `npm install --production`)
8. Click **Start Application**

### Alternative: Manual Setup

1. Create subdomain: `api.yourdomain.com`
2. Upload `deploy/backend/` to subdomain directory
3. SSH into server (if available)
4. Run:
   ```bash
   cd /path/to/backend
   npm install --production
   npm start
   ```

## Step 4: Configure CORS and API URL

1. Update frontend API URL:
   - Edit `deploy/frontend/` config files
   - Set API endpoint to your backend URL
   - Example: `https://api.yourdomain.com`

2. Update backend CORS:
   - In `deploy/backend/.env`:
   ```
   CLIENT_ORIGIN=https://yourdomain.com
   ```

## Step 5: Database Setup

1. Ensure MongoDB is accessible from Hostinger servers
2. Whitelist Hostinger IP addresses in MongoDB Atlas/Azure
3. Test connection from backend

## Step 6: SSL Certificate

1. Hostinger usually provides free SSL
2. Enable SSL in Control Panel
3. Force HTTPS redirect (handled by `.htaccess`)

## Step 7: Testing

1. **Frontend**: Visit `https://yourdomain.com`
2. **API Health**: Visit `https://api.yourdomain.com/health` (if endpoint exists)
3. **Registration**: Test user registration
4. **Login**: Test authentication
5. **Features**: Test all major features

## Troubleshooting

### Frontend Issues

- **404 on routes**: Check `.htaccess` is uploaded
- **API errors**: Verify API URL in frontend config
- **Assets not loading**: Check file permissions

### Backend Issues

- **Cannot connect to MongoDB**: Check IP whitelist
- **Port errors**: Verify PORT in environment variables
- **Module errors**: Run `npm install --production` again

### Common Fixes

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --production

# Check logs
# In Hostinger Node.js panel, check application logs
```

## Maintenance

### Updating Frontend

1. Rebuild frontend: `npm run build`
2. Upload new `dist/` contents to `public_html/`

### Updating Backend

1. Upload new backend files
2. Restart Node.js application in Hostinger panel

### Environment Variables

- Update in Hostinger Node.js panel
- Restart application after changes

## Security Checklist

- [ ] All environment variables set
- [ ] `.env` file not in public_html
- [ ] SSL certificate enabled
- [ ] CORS properly configured
- [ ] MongoDB credentials secure
- [ ] JWT secret is strong and random
- [ ] Rate limiting enabled
- [ ] Helmet security headers enabled

## Support

- Hostinger Support: https://www.hostinger.com/contact
- Project Issues: Check GitHub repository

