# 🚀 Hostinger Deployment - Quick Summary

## 📋 What You Need

1. ✅ Hostinger account (Web Hosting + Node.js support)
2. ✅ MongoDB Atlas account (free tier works)
3. ✅ Domain name connected to Hostinger

## 🔧 Step-by-Step Process

### 1️⃣ Build Your Project
```bash
npm run build:deploy
```
This creates `deploy/frontend/` and `deploy/backend/` folders.

### 2️⃣ Upload Frontend (5 minutes)

**Option A: File Manager**
- Log in to Hostinger → File Manager
- Go to `public_html/`
- Upload ALL files from `deploy/frontend/`
- ✅ Make sure `.htaccess` is uploaded

**Option B: FTP**
- Connect with FileZilla/WinSCP
- Upload `deploy/frontend/` to `public_html/`

### 3️⃣ Set Up Backend (10 minutes)

1. **Create Node.js App:**
   - Hostinger Panel → Node.js → Create Application
   - Name: `coffeehub-api`
   - Version: Node.js 18 or 20
   - Root: `/api` or use subdomain

2. **Upload Backend:**
   - Upload `deploy/backend/` folder contents
   - Include: `dist/`, `package.json`, `.env`

3. **Set Environment Variables:**
   - In Node.js Manager, add:
     ```
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=your_secret_key
     CLIENT_ORIGIN=https://yourdomain.com
     PORT=4000
     NODE_ENV=production
     ```

4. **Install & Start:**
   - Click "Install Dependencies"
   - Click "Start Application"

### 4️⃣ Database Setup (5 minutes)

1. Create MongoDB Atlas account
2. Create free cluster
3. Get connection string
4. Add Hostinger IP to whitelist (or use `0.0.0.0/0`)
5. Add connection string to backend `.env`

### 5️⃣ Test Everything

- ✅ Visit: `https://yourdomain.com` (should see your site)
- ✅ Test registration/login
- ✅ Check API: `https://api.yourdomain.com` (or your API URL)

## 📁 File Structure on Hostinger

```
public_html/              ← Frontend goes here
├── index.html
├── .htaccess
└── assets/

/api/ or subdomain/       ← Backend goes here
├── dist/
├── package.json
├── .env
└── node_modules/
```

## ⚙️ Environment Variables Checklist

Copy from `ENV_TEMPLATE.txt` to `backend/.env`:

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Random 32+ character string
- [ ] `CLIENT_ORIGIN` - Your domain (https://yourdomain.com)
- [ ] `SMTP_HOST` - Email server (smtp.gmail.com)
- [ ] `SMTP_USER` - Your email
- [ ] `SMTP_PASS` - Email app password

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| 404 on page refresh | Check `.htaccess` is uploaded |
| API not connecting | Verify CORS and `CLIENT_ORIGIN` |
| MongoDB error | Check IP whitelist in Atlas |
| App won't start | Check Node.js version (18+) |
| Module not found | Run `npm install --production` |

## 📚 Full Documentation

- **`HOSTINGER_GUIDE.md`** - Complete detailed guide (READ THIS!)
- **`QUICK_START.md`** - Fast deployment steps
- **`DEPLOYMENT.md`** - General deployment info

## ✅ Final Checklist

- [ ] Built deployment package
- [ ] Created `.env` with all variables
- [ ] Uploaded frontend to `public_html/`
- [ ] Created Node.js app in Hostinger
- [ ] Uploaded backend files
- [ ] Set environment variables
- [ ] Installed dependencies
- [ ] Started application
- [ ] Set up MongoDB Atlas
- [ ] Enabled SSL certificate
- [ ] Tested frontend
- [ ] Tested API
- [ ] Tested registration/login

---

**🎉 You're Ready!** Follow `HOSTINGER_GUIDE.md` for detailed instructions.

