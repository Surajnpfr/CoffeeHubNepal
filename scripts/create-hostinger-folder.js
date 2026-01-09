import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const deployRoot = path.join(projectRoot, 'deploy');
const outputFolder = path.join(projectRoot, 'CoffeeHubNepalHostinger');

console.log('📦 Creating ready-to-upload folder: CoffeeHubNepalHostinger...\n');

// Verify builds exist
const frontendSource = path.join(deployRoot, 'frontend');
const backendSource = path.join(deployRoot, 'backend');

if (!fs.existsSync(frontendSource)) {
  console.error('❌ Frontend build not found. Run npm run build:deploy first.');
  process.exit(1);
}

if (!fs.existsSync(backendSource)) {
  console.error('❌ Backend build not found. Run npm run build:deploy first.');
  process.exit(1);
}

// Verify critical files
const htaccessPath = path.join(frontendSource, '.htaccess');
if (!fs.existsSync(htaccessPath)) {
  console.warn('⚠️  Warning: .htaccess not found in frontend folder. React routing may not work.');
}

const backendDist = path.join(backendSource, 'dist');
if (!fs.existsSync(backendDist)) {
  console.error('❌ Backend dist folder not found. Run npm run build:deploy first.');
  process.exit(1);
}

console.log('✅ Verified build files exist\n');

// Remove existing folder if it exists
if (fs.existsSync(outputFolder)) {
  fs.rmSync(outputFolder, { recursive: true, force: true });
  console.log('🧹 Cleaned existing folder');
}

// Create main folder
fs.mkdirSync(outputFolder, { recursive: true });
console.log('✅ Created CoffeeHubNepalHostinger folder\n');

// Copy frontend folder
const frontendDest = path.join(outputFolder, 'FRONTEND');
copyRecursiveSync(frontendSource, frontendDest);
console.log('✅ Copied FRONTEND folder (upload to public_html/)');

// Verify .htaccess was copied
const htaccessDest = path.join(frontendDest, '.htaccess');
if (fs.existsSync(htaccessDest)) {
  console.log('✅ Verified .htaccess is included in FRONTEND');
} else {
  console.warn('⚠️  Warning: .htaccess not found in FRONTEND folder');
}

// Copy backend folder
const backendDest = path.join(outputFolder, 'BACKEND');
copyRecursiveSync(backendSource, backendDest);
console.log('✅ Copied BACKEND folder (upload to Node.js app directory)');

// Verify backend dist exists
const backendDistDest = path.join(backendDest, 'dist');
if (fs.existsSync(backendDistDest)) {
  console.log('✅ Verified dist/ folder is included in BACKEND');
} else {
  console.warn('⚠️  Warning: dist/ folder not found in BACKEND');
}

// Copy documentation
const docsToCopy = [
  'HOSTINGER_GUIDE.md',
  'DEPLOYMENT_SUMMARY.md',
  'QUICK_START.md',
  'README.md',
  'API_CONFIGURATION.md',
  'DEPLOYMENT_CHECKLIST.md',
  'ENV_TEMPLATE.txt'
];

docsToCopy.forEach(doc => {
  const src = path.join(deployRoot, doc);
  const dest = path.join(outputFolder, doc);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${doc}`);
  }
});

// Create README for the upload folder
const uploadReadme = `# CoffeeHubNepal - Ready to Upload to Hostinger

This folder contains everything you need to deploy CoffeeHubNepal to Hostinger.

## 📁 Folder Structure

\`\`\`
CoffeeHubNepalHostinger/
├── FRONTEND/              ← Upload this to public_html/
│   ├── index.html
│   ├── .htaccess
│   └── assets/
│
├── BACKEND/               ← Upload this to Node.js app directory
│   ├── dist/
│   ├── package.json
│   ├── ENV_TEMPLATE.txt
│   └── ...
│
└── Documentation files
    ├── HOSTINGER_GUIDE.md         ← READ THIS FIRST!
    ├── DEPLOYMENT_SUMMARY.md      ← Quick checklist
    ├── DEPLOYMENT_CHECKLIST.md    ← Step-by-step checklist
    ├── API_CONFIGURATION.md       ← API URL configuration
    ├── QUICK_START.md             ← Fast steps
    └── README.md                  ← Overview
\`\`\`

## 🚀 Quick Start

1. **Read the Guide:**
   - Open \`HOSTINGER_GUIDE.md\` for complete step-by-step instructions

2. **Upload Frontend:**
   - Upload ALL files from \`FRONTEND/\` folder to \`public_html/\` in Hostinger
   - Make sure \`.htaccess\` is included

3. **Upload Backend:**
   - Create Node.js app in Hostinger panel
   - Upload ALL files from \`BACKEND/\` folder to your Node.js app directory
   - Copy \`ENV_TEMPLATE.txt\` to \`.env\` and fill in your values
   - Set environment variables in Hostinger Node.js Manager
   - Run \`npm install --production\`
   - Start the application

4. **Set Up Database:**
   - Create MongoDB Atlas account (free tier works)
   - Get connection string
   - Add to backend \`.env\` file

## 📚 Documentation

- **HOSTINGER_GUIDE.md** - Complete detailed guide (READ THIS!)
- **DEPLOYMENT_CHECKLIST.md** - Step-by-step deployment checklist
- **API_CONFIGURATION.md** - API URL configuration guide (IMPORTANT!)
- **DEPLOYMENT_SUMMARY.md** - Quick reference checklist
- **QUICK_START.md** - Fast deployment steps
- **README.md** - Overview and folder structure

## ⚙️ Environment Variables

Before starting the backend, you MUST:

1. Copy \`BACKEND/ENV_TEMPLATE.txt\` to \`BACKEND/.env\`
2. Fill in all required values:
   - \`MONGO_URI\` - MongoDB connection string
   - \`JWT_SECRET\` - Random 32+ character string
   - \`CLIENT_ORIGIN\` - Your domain URL
   - Email settings (SMTP)
3. Set these in Hostinger Node.js Manager as well

## ✅ Checklist

- [ ] Read \`HOSTINGER_GUIDE.md\`
- [ ] Upload FRONTEND to \`public_html/\`
- [ ] Create Node.js app in Hostinger
- [ ] Upload BACKEND to Node.js app directory
- [ ] Create \`.env\` file with all variables
- [ ] Set environment variables in Hostinger panel
- [ ] Install dependencies (\`npm install --production\`)
- [ ] Start Node.js application
- [ ] Set up MongoDB Atlas
- [ ] Test the application

## 🆘 Need Help?

Check \`HOSTINGER_GUIDE.md\` for:
- Detailed step-by-step instructions
- Troubleshooting section
- Common issues and solutions

---

**Good luck with your deployment! 🎉**
`;

fs.writeFileSync(path.join(outputFolder, 'START_HERE.md'), uploadReadme);
console.log('✅ Created START_HERE.md\n');

console.log('🎉 Ready-to-upload folder created successfully!\n');
console.log('📂 Location:', outputFolder);
console.log('\n📖 Next steps:');
console.log('   1. Read START_HERE.md or HOSTINGER_GUIDE.md');
console.log('   2. Upload FRONTEND/ to public_html/');
console.log('   3. Upload BACKEND/ to Node.js app directory');
console.log('   4. Configure environment variables');
console.log('   5. Deploy! 🚀\n');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

