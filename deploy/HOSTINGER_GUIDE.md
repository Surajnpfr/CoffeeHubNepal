# Complete Hostinger Deployment Guide

## Prerequisites

1. Hostinger account with:
   - **Web Hosting** (for frontend static files)
   - **Node.js Hosting** (for backend API) - Available in Business/Cloud plans
2. MongoDB database (MongoDB Atlas recommended - free tier available)
3. Domain name connected to Hostinger

## Step 1: Build the Deployment Package

From your project root directory:

```bash
npm run build:deploy
```

This creates:
- `deploy/frontend/` - All static files ready to upload
- `deploy/backend/` - Node.js API ready to deploy

## Step 2: Prepare Environment Variables

1. Go to `deploy/backend/` folder
2. Copy `ENV_TEMPLATE.txt` and rename it to `.env`
3. Fill in your values:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/coffeehubnepal
JWT_SECRET=your_very_long_random_secret_key_here
CLIENT_ORIGIN=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Step 3: Deploy Frontend (Static Files)

### Option A: Using Hostinger File Manager

1. **Log in to Hostinger:**
   - Go to https://hpanel.hostinger.com
   - Log in with your credentials

2. **Open File Manager:**
   - Click on your domain
   - Go to **File Manager** in the left sidebar

3. **Navigate to public_html:**
   - This is your website root directory

4. **Upload Frontend Files:**
   - Select ALL files from `deploy/frontend/` folder
   - Upload them to `public_html/`
   - **Important:** Make sure `.htaccess` file is uploaded (it might be hidden)

5. **Verify Upload:**
   - Check that `index.html` is in `public_html/`
   - Check that `.htaccess` exists

### Option B: Using FTP (FileZilla, WinSCP, etc.)

1. **Get FTP Credentials:**
   - In Hostinger panel → **FTP Accounts**
   - Note your FTP host, username, and password

2. **Connect via FTP:**
   - Host: `ftp.yourdomain.com` or IP address
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21

3. **Upload Files:**
   - Navigate to `public_html/` on server
   - Upload all files from `deploy/frontend/`
   - Set permissions:
     - Folders: 755
     - Files: 644

## Step 4: Deploy Backend API (Node.js)

### Method 1: Using Hostinger Node.js Manager (Recommended)

1. **Access Node.js Manager:**
   - In Hostinger panel → **Advanced** → **Node.js**
   - Or search for "Node.js" in the panel

2. **Create New Application:**
   - Click **Create Application** or **Add New**
   - Fill in:
     - **Application Name:** `coffeehub-api`
     - **Node.js Version:** `18.x` or `20.x` (latest LTS)
     - **Application Root:** `/api` or `/backend` (or use subdomain)
     - **Application URL:** `https://api.yourdomain.com` (if using subdomain)

3. **Upload Backend Files:**
   - Use File Manager or FTP
   - Navigate to the application root directory
   - Upload ALL files from `deploy/backend/` folder:
     - `dist/` folder (compiled JavaScript)
     - `package.json`
     - `tsconfig.json`
     - `.env` file (with your environment variables)

4. **Set Environment Variables:**
   - In Node.js Manager, find **Environment Variables** section
   - Add each variable from your `.env` file:
     ```
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_secret
     CLIENT_ORIGIN=https://yourdomain.com
     PORT=4000
     NODE_ENV=production
     ... (all other variables)
     ```

5. **Install Dependencies:**
   - In Node.js Manager, click **Install Dependencies**
   - Or SSH into server and run:
     ```bash
     cd /path/to/your/app
     npm install --production
     ```

6. **Start Application:**
   - Set **Start Command:** `npm start`
   - Click **Start Application** or **Restart**

### Method 2: Using Subdomain

1. **Create Subdomain:**
   - In Hostinger panel → **Domains** → **Subdomains**
   - Create: `api.yourdomain.com`
   - Point to a directory like `/public_html/api`

2. **Upload Backend:**
   - Upload `deploy/backend/` contents to subdomain directory
   - Set up Node.js app pointing to this directory
   - Follow steps from Method 1

## Step 5: Configure API URL in Frontend

After deploying, you need to update the API endpoint in your frontend code:

1. **Find API Configuration:**
   - Check `apps/web/src/services/api.ts` or similar
   - Update the base URL to your backend URL

2. **Rebuild Frontend:**
   ```bash
   npm run build:deploy
   ```

3. **Re-upload Frontend:**
   - Upload new `deploy/frontend/` files

## Step 6: Database Setup

1. **MongoDB Atlas (Recommended):**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Add Hostinger server IP to whitelist:
     - In Atlas → Network Access
     - Add IP: `0.0.0.0/0` (allows all) or specific Hostinger IP

2. **Update MONGO_URI:**
   - Use the connection string from Atlas
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

## Step 7: SSL Certificate

1. **Enable SSL:**
   - Hostinger usually provides free SSL
   - In panel → **SSL** → Enable for your domain
   - Wait for activation (usually automatic)

2. **Force HTTPS:**
   - `.htaccess` file already configured for this
   - Verify it redirects HTTP to HTTPS

## Step 8: Testing

1. **Test Frontend:**
   - Visit: `https://yourdomain.com`
   - Should see CoffeeHubNepal landing page

2. **Test API:**
   - Visit: `https://api.yourdomain.com` (or your API URL)
   - Should see API response or error (not 404)

3. **Test Registration:**
   - Try creating an account
   - Check if it connects to MongoDB

4. **Check Logs:**
   - In Node.js Manager → **Logs**
   - Check for any errors

## Troubleshooting

### Frontend Issues

**Problem:** 404 errors on page refresh
- **Solution:** Ensure `.htaccess` is uploaded and working

**Problem:** API calls failing
- **Solution:** Check CORS settings in backend
- **Solution:** Verify `CLIENT_ORIGIN` in backend `.env`

**Problem:** Assets not loading
- **Solution:** Check file permissions (644 for files, 755 for folders)
- **Solution:** Verify file paths in browser console

### Backend Issues

**Problem:** Cannot connect to MongoDB
- **Solution:** Check MongoDB Atlas IP whitelist
- **Solution:** Verify `MONGO_URI` is correct
- **Solution:** Check MongoDB connection string format

**Problem:** Application won't start
- **Solution:** Check Node.js version (should be 18+)
- **Solution:** Verify `npm start` command works
- **Solution:** Check application logs in Node.js Manager

**Problem:** Port already in use
- **Solution:** Hostinger manages ports automatically
- **Solution:** Don't hardcode PORT in code, use environment variable

**Problem:** Module not found errors
- **Solution:** Run `npm install --production` in backend directory
- **Solution:** Ensure `package.json` is uploaded

### Common Fixes

```bash
# SSH into server (if available)
cd /path/to/backend
npm install --production
npm start

# Check Node.js version
node --version

# Check if application is running
ps aux | grep node
```

## File Structure on Hostinger

```
public_html/                    (Frontend)
├── index.html
├── .htaccess
├── assets/
│   ├── index-*.js
│   └── index-*.css
└── ...

/path/to/nodejs/app/           (Backend)
├── dist/
│   ├── server.js
│   └── ...
├── package.json
├── .env
└── node_modules/
```

## Environment Variables Checklist

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)
- [ ] `CLIENT_ORIGIN` - Your frontend URL (https://yourdomain.com)
- [ ] `PORT` - Usually 4000 (or let Hostinger assign)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `SMTP_HOST` - Email server (e.g., smtp.gmail.com)
- [ ] `SMTP_PORT` - Usually 587
- [ ] `SMTP_USER` - Your email
- [ ] `SMTP_PASS` - Email app password

## Support Resources

- **Hostinger Support:** https://www.hostinger.com/contact
- **Hostinger Docs:** https://support.hostinger.com
- **Node.js on Hostinger:** Check Hostinger knowledge base for Node.js setup

## Quick Checklist

- [ ] Built deployment package (`npm run build:deploy`)
- [ ] Created `.env` file with all variables
- [ ] Uploaded frontend to `public_html/`
- [ ] Created Node.js application in Hostinger
- [ ] Uploaded backend files
- [ ] Set environment variables in Node.js Manager
- [ ] Installed dependencies (`npm install --production`)
- [ ] Started Node.js application
- [ ] Configured MongoDB Atlas and whitelisted IPs
- [ ] Enabled SSL certificate
- [ ] Tested frontend (https://yourdomain.com)
- [ ] Tested API connection
- [ ] Tested user registration/login

## Next Steps After Deployment

1. **Monitor Logs:** Check Node.js application logs regularly
2. **Set Up Backups:** Configure automatic backups in Hostinger
3. **Monitor Performance:** Use Hostinger analytics
4. **Update DNS:** If using custom domain, ensure DNS is configured
5. **Test All Features:** Thoroughly test all application features

---

**Need Help?** Check the `DEPLOYMENT.md` file for more detailed information.

