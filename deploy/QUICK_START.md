# Quick Start Guide - Hostinger Deployment

> **For complete detailed instructions, see `HOSTINGER_GUIDE.md`**

## Step 1: Build the Deployment Package

From the project root, run:

```bash
npm run build:deploy
```

This will:
- Build the React frontend
- Build the TypeScript API
- Copy everything to `deploy/` folder

## Step 2: Configure Environment Variables

1. Go to `deploy/backend/`
2. Copy `ENV_TEMPLATE.txt` to `.env`
3. Fill in all required values (especially `MONGO_URI` and `JWT_SECRET`)

## Step 3: Upload to Hostinger

### Frontend (Static Files)

1. **Using File Manager:**
   - Log in to Hostinger Control Panel
   - Go to **File Manager**
   - Navigate to `public_html/`
   - Upload ALL files from `deploy/frontend/` folder
   - Make sure `.htaccess` is uploaded

2. **Using FTP:**
   - Connect via FTP client
   - Upload `deploy/frontend/` contents to `public_html/`
   - Set permissions: folders 755, files 644

### Backend (Node.js API)

1. **Using Node.js Manager:**
   - Go to Hostinger Control Panel → **Node.js**
   - Click **Create Application**
   - Application Root: `/backend` or subdomain path
   - Upload `deploy/backend/` folder contents
   - Set environment variables in Hostinger panel
   - Click **Install Dependencies**
   - Click **Start Application**

2. **Start Command:** `npm start`

## Step 4: Update API URL in Frontend

After deploying, update the API URL in your frontend code to point to your backend URL.

## Step 5: Test

- Visit your domain: `https://yourdomain.com`
- Test registration and login
- Verify API is working

## Troubleshooting

- **404 errors**: Check `.htaccess` is uploaded
- **API not connecting**: Verify API URL and CORS settings
- **Build errors**: Make sure you ran `npm run build:deploy` first

For detailed instructions, see `DEPLOYMENT.md`

