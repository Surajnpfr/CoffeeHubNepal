# Hostinger Deployment Checklist

Use this checklist to ensure a successful deployment of CoffeeHubNepal to Hostinger.

## Pre-Deployment

- [ ] **Read Documentation**
  - [ ] Read `HOSTINGER_GUIDE.md` completely
  - [ ] Read `API_CONFIGURATION.md` to understand API URL setup
  - [ ] Review `DEPLOYMENT_SUMMARY.md` for quick reference

- [ ] **Prepare Environment**
  - [ ] Create MongoDB Atlas account (or use existing)
  - [ ] Create MongoDB cluster and database
  - [ ] Get MongoDB connection string
  - [ ] Prepare email service credentials (Gmail app password or Azure)
  - [ ] Generate JWT secret (use: `openssl rand -base64 32`)

- [ ] **Build Project**
  - [ ] Run `npm run build:deploy` from project root
  - [ ] Verify `deploy/frontend/` folder exists with files
  - [ ] Verify `deploy/backend/` folder exists with `dist/` folder
  - [ ] Verify `.htaccess` is in `deploy/frontend/`

- [ ] **Configure API URL (if needed)**
  - [ ] Determine your API URL (subdomain or same domain)
  - [ ] If different from default, rebuild with `VITE_API_URL` set
  - [ ] See `API_CONFIGURATION.md` for details

- [ ] **Create Hostinger Folder**
  - [ ] Run `npm run create:hostinger`
  - [ ] Verify `CoffeeHubNepalHostinger/` folder is created
  - [ ] Check that `FRONTEND/` and `BACKEND/` folders exist

## Frontend Deployment

- [ ] **Upload Frontend Files**
  - [ ] Log in to Hostinger Control Panel
  - [ ] Open File Manager
  - [ ] Navigate to `public_html/` directory
  - [ ] Upload ALL files from `CoffeeHubNepalHostinger/FRONTEND/`
  - [ ] Verify `index.html` is in `public_html/`
  - [ ] Verify `.htaccess` is uploaded (may be hidden - enable "Show hidden files")

- [ ] **Verify Frontend Files**
  - [ ] Check file permissions (folders: 755, files: 644)
  - [ ] Verify `assets/` folder contains CSS and JS files
  - [ ] Verify favicon files are present

- [ ] **Test Frontend**
  - [ ] Visit `https://yourdomain.com`
  - [ ] Verify homepage loads
  - [ ] Check browser console for errors
  - [ ] Verify no 404 errors for assets

## Backend Deployment

- [ ] **Create Node.js Application**
  - [ ] Go to Hostinger Control Panel → Node.js
  - [ ] Click "Create Application"
  - [ ] Set application name: `coffeehub-api`
  - [ ] Select Node.js version: 18.x or 20.x (LTS)
  - [ ] Set application root directory (e.g., `/api` or subdomain path)
  - [ ] Note the application URL

- [ ] **Upload Backend Files**
  - [ ] Upload ALL files from `CoffeeHubNepalHostinger/BACKEND/` to Node.js app directory
  - [ ] Verify `dist/` folder is uploaded
  - [ ] Verify `package.json` is uploaded
  - [ ] Verify `ENV_TEMPLATE.txt` is uploaded

- [ ] **Configure Environment Variables**
  - [ ] Copy `ENV_TEMPLATE.txt` to `.env` in backend directory
  - [ ] Fill in all required values:
    - [ ] `MONGO_URI` - MongoDB connection string
    - [ ] `JWT_SECRET` - Strong random secret (32+ characters)
    - [ ] `CLIENT_ORIGIN` - Your frontend domain (https://yourdomain.com)
    - [ ] `PORT` - Usually 4000 (or let Hostinger assign)
    - [ ] `NODE_ENV` - Set to `production`
    - [ ] `SMTP_HOST` - Email server
    - [ ] `SMTP_PORT` - Usually 587
    - [ ] `SMTP_USER` - Your email
    - [ ] `SMTP_PASS` - Email app password
  - [ ] Set same variables in Hostinger Node.js Manager → Environment Variables

- [ ] **Install Dependencies**
  - [ ] In Node.js Manager, click "Install Dependencies"
  - [ ] Or SSH and run: `npm install --production`
  - [ ] Verify `node_modules/` folder is created

- [ ] **Start Application**
  - [ ] Set start command: `npm start` (or `node dist/server.js`)
  - [ ] Click "Start Application" in Node.js Manager
  - [ ] Check application logs for errors
  - [ ] Verify application is running

## Database Setup

- [ ] **MongoDB Atlas Configuration**
  - [ ] Create MongoDB Atlas account (if not done)
  - [ ] Create free cluster
  - [ ] Get connection string
  - [ ] Add Hostinger server IP to Network Access whitelist
    - [ ] Option 1: Add specific Hostinger IP
    - [ ] Option 2: Temporarily allow all IPs (`0.0.0.0/0`) for testing
  - [ ] Update `MONGO_URI` in backend `.env`

- [ ] **Test Database Connection**
  - [ ] Check backend logs for MongoDB connection success
  - [ ] Verify no connection errors

## SSL & Security

- [ ] **Enable SSL Certificate**
  - [ ] Go to Hostinger Control Panel → SSL
  - [ ] Enable SSL for your domain
  - [ ] Wait for activation (usually automatic)
  - [ ] Verify HTTPS is working

- [ ] **Verify HTTPS Redirect**
  - [ ] Visit `http://yourdomain.com` (should redirect to HTTPS)
  - [ ] Check `.htaccess` is enforcing HTTPS

## Post-Deployment Testing

- [ ] **Frontend Tests**
  - [ ] Homepage loads correctly
  - [ ] Navigation works
  - [ ] No console errors
  - [ ] Assets load properly (images, CSS, JS)

- [ ] **API Connection Tests**
  - [ ] Open browser Developer Tools → Network tab
  - [ ] Try to register a new account
  - [ ] Verify API requests go to correct URL
  - [ ] Check for CORS errors
  - [ ] Verify API responses are received

- [ ] **Authentication Tests**
  - [ ] Register a new user account
  - [ ] Verify email is received (if email service configured)
  - [ ] Log in with credentials
  - [ ] Verify JWT token is stored
  - [ ] Test protected routes

- [ ] **Feature Tests**
  - [ ] Create a blog post
  - [ ] View blog posts
  - [ ] Test marketplace (if applicable)
  - [ ] Test job board (if applicable)
  - [ ] Test user profile

- [ ] **Error Handling**
  - [ ] Test 404 pages
  - [ ] Test error messages
  - [ ] Verify error logging

## Final Verification

- [ ] **Performance Check**
  - [ ] Page load times are acceptable
  - [ ] API response times are reasonable
  - [ ] No memory leaks in logs

- [ ] **Security Check**
  - [ ] HTTPS is enforced
  - [ ] Environment variables are not exposed
  - [ ] `.env` file is not accessible via web
  - [ ] CORS is properly configured

- [ ] **Monitoring Setup**
  - [ ] Set up application monitoring (if available)
  - [ ] Configure error alerts
  - [ ] Set up backup schedule

## Troubleshooting

If something doesn't work:

1. **Check Logs**
   - [ ] Frontend: Browser console
   - [ ] Backend: Node.js Manager → Logs
   - [ ] Server: Hostinger error logs

2. **Verify Configuration**
   - [ ] Environment variables are set correctly
   - [ ] API URL matches in frontend build
   - [ ] CORS settings allow your domain

3. **Common Issues**
   - [ ] 404 errors → Check `.htaccess` is uploaded
   - [ ] CORS errors → Check `CLIENT_ORIGIN` in backend
   - [ ] API not connecting → Verify API URL in frontend build
   - [ ] Database errors → Check MongoDB connection string and IP whitelist

## Documentation

Keep these files for reference:
- [ ] `HOSTINGER_GUIDE.md` - Complete guide
- [ ] `API_CONFIGURATION.md` - API URL setup
- [ ] `DEPLOYMENT_SUMMARY.md` - Quick reference
- [ ] `ENV_TEMPLATE.txt` - Environment variables template

## Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ API connects and responds
- ✅ Users can register and log in
- ✅ All features work as expected
- ✅ HTTPS is enforced
- ✅ No console errors

---

**Congratulations! 🎉** If all items are checked, your CoffeeHubNepal application is successfully deployed to Hostinger!

