# CoffeeHubNepal - Hostinger Deployment Guide

This folder contains the production-ready files for deploying to Hostinger.

## Folder Structure

```
deploy/
├── frontend/          # Built React frontend (static files)
├── backend/           # Node.js API server
├── .htaccess         # Apache configuration for frontend
├── package.json       # Root package.json for deployment
├── ENV_TEMPLATE.txt   # Environment variables template
└── DEPLOYMENT.md      # Detailed deployment instructions
```

## Quick Start

### Option 1: Static Frontend + Separate API (Recommended)

1. **Frontend (Static Hosting)**
   - Upload `frontend/` folder contents to `public_html/` or your domain root
   - Ensure `.htaccess` is uploaded

2. **Backend (Node.js Hosting)**
   - Upload `backend/` folder to a subdomain or separate directory
   - Set up Node.js environment in Hostinger
   - Configure environment variables

### Option 2: Combined Deployment

- Upload entire `deploy/` folder
- Configure Hostinger to serve frontend from root and API from `/api`

## Environment Variables

Copy `ENV_TEMPLATE.txt` to `backend/.env` and fill in your values:

```bash
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Client URL
CLIENT_ORIGIN=https://yourdomain.com

# Email (SMTP or Azure)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Build Instructions

Run these commands to build the deployment folder:

```bash
# From project root
npm run build:deploy
```

This will:
1. Build the React frontend
2. Copy API files
3. Create optimized production bundle

## Hostinger Configuration

### For Static Frontend:
- Use Hostinger's File Manager or FTP
- Upload `frontend/` contents to `public_html/`
- Ensure `.htaccess` is present

### For Node.js API:
1. Go to Hostinger Control Panel
2. Navigate to Node.js section
3. Create new Node.js app
4. Point to `backend/` folder
5. Set start command: `npm start`
6. Configure environment variables

## Quick Hostinger Deployment

1. **Build:** Run `npm run build:deploy` from project root
2. **Frontend:** Upload `deploy/frontend/` to `public_html/` via File Manager or FTP
3. **Backend:** Create Node.js app in Hostinger panel, upload `deploy/backend/`, set environment variables
4. **Database:** Set up MongoDB Atlas, add connection string to backend `.env`
5. **Test:** Visit your domain and test the application

**For detailed step-by-step instructions, see `HOSTINGER_GUIDE.md`**

## Support

For issues, check:
- `HOSTINGER_GUIDE.md` - Complete Hostinger deployment guide
- `DEPLOYMENT.md` - General deployment instructions
- `QUICK_START.md` - Fast deployment steps
- Hostinger documentation
- Project README files

