# Node.js Combined Deployment Guide for Hostinger

## Overview

This guide explains how to deploy CoffeeHubNepal as a **single Node.js application** on Hostinger. The application serves both:
- React frontend (static files)
- API backend (Express routes)

Everything runs from one Node.js server on a single port.

## Prerequisites

1. Hostinger account with **Node.js Hosting** (Business/Cloud plan)
2. MongoDB database (MongoDB Atlas recommended - free tier available)
3. Domain name connected to Hostinger

## Architecture

```
┌─────────────────────────────────────┐
│     Single Node.js Application     │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │   Express   │  │   React      │ │
│  │   API       │  │   Frontend   │ │
│  │   Routes    │  │   (Static)   │ │
│  └─────────────┘  └──────────────┘ │
│                                     │
│  Port: 4000 (or Hostinger assigned)│
└─────────────────────────────────────┘
```

- **API Routes**: `/auth`, `/blog`, `/admin`, `/health`
- **Frontend**: Served from `public/` folder
- **React Router**: Catch-all route serves `index.html` for client-side routing

## Step 1: Build the Deployment Package

From your project root directory:

```bash
npm run create:nodejs
```

This will:
1. Build the React frontend
2. Build the Node.js backend
3. Copy React build to `deploy/backend/public/`
4. Create `CoffeeHubNepalNodeJS/` folder with everything

## Step 2: Prepare Environment Variables

1. Go to `CoffeeHubNepalNodeJS/` folder
2. Copy `ENV_TEMPLATE.txt` and rename it to `.env`
3. Fill in your values:

```env
# Server Configuration
PORT=4000
NODE_ENV=production
SERVE_STATIC_FILES=true  # IMPORTANT: Enable static file serving

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/coffeehubnepal

# Security
JWT_SECRET=your_very_long_random_secret_key_here

# Client URL (same as server URL since everything is on one domain)
CLIENT_ORIGIN=https://yourdomain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Important Environment Variables

- **`SERVE_STATIC_FILES=true`** - Must be set to enable React frontend serving
- **`CLIENT_ORIGIN`** - Should match your domain (same origin as API)
- **`PORT`** - Usually 4000, or let Hostinger assign automatically

## Step 3: Deploy to Hostinger

### 3.1 Create Node.js Application

1. **Log in to Hostinger:**
   - Go to https://hpanel.hostinger.com
   - Log in with your credentials

2. **Create Node.js Application:**
   - Go to **Advanced** → **Node.js**
   - Click **Create Application** or **Add New**
   - Fill in:
     - **Application Name:** `coffeehubnepal`
     - **Node.js Version:** `18.x` or `20.x` (LTS)
     - **Application Root:** `/coffeehubnepal` or your preferred path
     - **Application URL:** `https://yourdomain.com` (or subdomain)

### 3.2 Upload Files

**Option A: Using File Manager**

1. Go to **File Manager** in Hostinger panel
2. Navigate to your Node.js application directory
3. Upload **ALL files** from `CoffeeHubNepalNodeJS/` folder:
   - `dist/` folder
   - `public/` folder
   - `package.json`
   - `.env` file (create it from ENV_TEMPLATE.txt)
   - `ENV_TEMPLATE.txt`
   - `README.md`

**Option B: Using FTP**

1. Get FTP credentials from Hostinger
2. Connect via FileZilla/WinSCP
3. Navigate to Node.js app directory
4. Upload all files from `CoffeeHubNepalNodeJS/`

### 3.3 Configure Environment Variables

1. In Node.js Manager, find **Environment Variables** section
2. Add each variable from your `.env` file:
   ```
   SERVE_STATIC_FILES=true
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLIENT_ORIGIN=https://yourdomain.com
   PORT=4000
   NODE_ENV=production
   ... (all other variables)
   ```

### 3.4 Install Dependencies

1. In Node.js Manager, click **Install Dependencies**
2. Or SSH into server and run:
   ```bash
   cd /path/to/your/app
   npm install --production
   ```

### 3.5 Start Application

1. Set **Start Command:** `npm start` (or `node dist/server.js`)
2. Click **Start Application** or **Restart**
3. Check application logs for any errors

## Step 4: Database Setup

1. **MongoDB Atlas:**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Add Hostinger server IP to whitelist:
     - In Atlas → Network Access
     - Add IP: `0.0.0.0/0` (allows all) or specific Hostinger IP

2. **Update MONGO_URI:**
   - Use the connection string from Atlas
   - Add to `.env` file and Hostinger environment variables

## Step 5: Testing

### Test Frontend

1. Visit: `https://yourdomain.com`
2. Should see CoffeeHubNepal homepage
3. Check browser console for errors

### Test API

1. Visit: `https://yourdomain.com/health`
2. Should see: `{"status":"ok"}`
3. Try: `https://yourdomain.com/auth/login` (should return API response, not 404)

### Test Full Flow

1. Register a new user account
2. Log in
3. Create a blog post
4. Verify all features work

## File Structure on Hostinger

```
/your-nodejs-app-directory/
├── dist/                    (Backend API code)
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   └── ...
├── public/                  (React frontend)
│   ├── index.html
│   ├── assets/
│   └── ...
├── package.json
├── .env                     (Environment variables)
└── node_modules/            (After npm install)
```

## How It Works

### Request Flow

1. **API Requests** (`/auth`, `/blog`, `/admin`):
   - Handled by Express routes
   - Returns JSON responses

2. **Static Files** (`/assets/*`, `/favicon.ico`, etc.):
   - Served from `public/` folder
   - Cached for performance

3. **React Router Routes** (`/`, `/blog`, `/profile`, etc.):
   - Catch-all route serves `index.html`
   - React Router handles client-side routing

### Route Priority

```
1. /health          → API route
2. /auth/*          → API route
3. /blog/*          → API route
4. /admin/*         → API route
5. /assets/*        → Static files from public/
6. /*               → index.html (React Router)
```

## Troubleshooting

### Problem: Frontend not loading

**Solution:**
- Check `SERVE_STATIC_FILES=true` is set in environment variables
- Verify `public/` folder exists and contains `index.html`
- Check application logs for errors

### Problem: API routes return 404

**Solution:**
- Verify `dist/` folder is uploaded
- Check `package.json` start script is correct
- Verify application is running (check logs)

### Problem: React Router not working (404 on page refresh)

**Solution:**
- This is normal for client-side routing
- The catch-all route should handle this
- Verify the catch-all route is working in `app.ts`

### Problem: CORS errors

**Solution:**
- Since frontend and API are on same domain, CORS should allow same-origin
- Verify `CLIENT_ORIGIN` matches your domain
- Check CORS configuration in `app.ts`

### Problem: Cannot connect to MongoDB

**Solution:**
- Check MongoDB Atlas IP whitelist
- Verify `MONGO_URI` is correct
- Check connection string format

### Problem: Application won't start

**Solution:**
- Check Node.js version (should be 18+)
- Verify `npm install --production` completed
- Check application logs in Node.js Manager
- Verify `dist/server.js` exists

## Environment Variables Checklist

- [ ] `SERVE_STATIC_FILES=true` (CRITICAL - enables frontend)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)
- [ ] `CLIENT_ORIGIN` - Your domain (https://yourdomain.com)
- [ ] `PORT` - Usually 4000 (or Hostinger assigned)
- [ ] `NODE_ENV=production`
- [ ] `SMTP_HOST` - Email server
- [ ] `SMTP_USER` - Your email
- [ ] `SMTP_PASS` - Email app password

## Benefits of Combined Deployment

✅ **Single Deployment** - Everything in one package
✅ **Easier Management** - One server to manage
✅ **No CORS Issues** - Same origin for frontend and API
✅ **Simplified Setup** - No need for separate static hosting
✅ **Single Port** - Everything runs on one port
✅ **Cost Effective** - Only need Node.js hosting

## Comparison: Combined vs Separate

| Feature | Combined (This Guide) | Separate (Traditional) |
|---------|----------------------|------------------------|
| Deployment | Single Node.js app | Frontend + Backend |
| Ports | One port | Two (or static + API) |
| CORS | Not needed | Required |
| Complexity | Simpler | More complex |
| Hosting | Node.js only | Static + Node.js |

## Quick Reference

```bash
# Build and create deployment package
npm run create:nodejs

# The output folder is ready to upload:
CoffeeHubNepalNodeJS/
```

## Support

For issues:
- Check application logs in Hostinger Node.js Manager
- Verify all environment variables are set
- Ensure `SERVE_STATIC_FILES=true` is set
- Check MongoDB connection
- Verify file structure matches expected layout

---

**Your combined Node.js application is ready to deploy! 🚀**

