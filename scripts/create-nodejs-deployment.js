import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const deployBackend = path.join(projectRoot, 'deploy', 'backend');
const outputFolder = path.join(projectRoot, 'CoffeeHubNepalNodeJS');

console.log('📦 Creating combined Node.js deployment folder: CoffeeHubNepalNodeJS...\n');

// Verify builds exist
if (!fs.existsSync(deployBackend)) {
  console.error('❌ Backend deployment not found. Run npm run build:deploy first.');
  process.exit(1);
}

const publicFolder = path.join(deployBackend, 'public');
if (!fs.existsSync(publicFolder)) {
  console.error('❌ Public folder (React build) not found. Run npm run build:deploy first.');
  process.exit(1);
}

const distFolder = path.join(deployBackend, 'dist');
if (!fs.existsSync(distFolder)) {
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
console.log('✅ Created CoffeeHubNepalNodeJS folder\n');

// Copy entire backend deployment (includes public folder with React build)
copyRecursiveSync(deployBackend, outputFolder);
console.log('✅ Copied combined Node.js application\n');

// Verify critical files
const packageJsonPath = path.join(outputFolder, 'package.json');
const distPath = path.join(outputFolder, 'dist');
const publicPath = path.join(outputFolder, 'public');
const indexHtmlPath = path.join(publicPath, 'index.html');

if (fs.existsSync(packageJsonPath)) {
  console.log('✅ Verified package.json');
} else {
  console.error('❌ package.json not found!');
  process.exit(1);
}

if (fs.existsSync(distPath)) {
  console.log('✅ Verified dist/ folder (backend code)');
} else {
  console.error('❌ dist/ folder not found!');
  process.exit(1);
}

if (fs.existsSync(publicPath)) {
  console.log('✅ Verified public/ folder (React build)');
} else {
  console.error('❌ public/ folder not found!');
  process.exit(1);
}

if (fs.existsSync(indexHtmlPath)) {
  console.log('✅ Verified public/index.html');
} else {
  console.warn('⚠️  Warning: public/index.html not found. React app may not work.');
}

// Copy documentation
const docsToCopy = [
  'NODEJS_DEPLOYMENT.md',
  'ENV_TEMPLATE.txt'
];

const deployRoot = path.join(projectRoot, 'deploy');
docsToCopy.forEach(doc => {
  const src = path.join(deployRoot, doc);
  const dest = path.join(outputFolder, doc);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${doc}`);
  }
});

// Create README for the deployment folder
const deploymentReadme = `# CoffeeHubNepal - Combined Node.js Deployment

This folder contains a **single Node.js application** that serves both:
- React frontend (static files)
- API backend (Express routes)

## 📁 Folder Structure

\`\`\`
CoffeeHubNepalNodeJS/
├── dist/              ← Backend API code (compiled)
├── public/            ← React frontend build (static files)
│   ├── index.html
│   ├── assets/
│   └── ...
├── package.json       ← Node.js dependencies
├── ENV_TEMPLATE.txt   ← Environment variables template
└── NODEJS_DEPLOYMENT.md ← Deployment instructions
\`\`\`

## 🚀 Quick Start

1. **Read the Guide:**
   - Open \`NODEJS_DEPLOYMENT.md\` for complete deployment instructions

2. **Configure Environment:**
   - Copy \`ENV_TEMPLATE.txt\` to \`.env\`
   - Fill in all required values
   - Set \`SERVE_STATIC_FILES=true\` to enable static file serving

3. **Deploy to Hostinger:**
   - Upload ALL files to your Node.js app directory
   - Set environment variables in Hostinger Node.js Manager
   - Run \`npm install --production\`
   - Start the application

## ⚙️ How It Works

- **API Routes**: \`/auth\`, \`/blog\`, \`/admin\`, \`/health\`
- **Static Files**: Served from \`public/\` folder
- **React Router**: Catch-all route serves \`index.html\` for client-side routing
- **Single Port**: Everything runs on one port (default: 4000)

## 📚 Documentation

- **NODEJS_DEPLOYMENT.md** - Complete deployment guide
- **ENV_TEMPLATE.txt** - Environment variables template

## ✅ Checklist

- [ ] Read \`NODEJS_DEPLOYMENT.md\`
- [ ] Create \`.env\` file with all variables
- [ ] Set \`SERVE_STATIC_FILES=true\` in \`.env\`
- [ ] Upload all files to Hostinger Node.js app
- [ ] Set environment variables in Hostinger panel
- [ ] Install dependencies (\`npm install --production\`)
- [ ] Start the application
- [ ] Test frontend and API

---

**This is a combined Node.js deployment - everything runs from one server! 🎉**
`;

fs.writeFileSync(path.join(outputFolder, 'README.md'), deploymentReadme);
console.log('✅ Created README.md\n');

console.log('🎉 Combined Node.js deployment folder created successfully!\n');
console.log('📂 Location:', outputFolder);
console.log('\n📖 Next steps:');
console.log('   1. Read NODEJS_DEPLOYMENT.md');
console.log('   2. Configure .env file (set SERVE_STATIC_FILES=true)');
console.log('   3. Upload to Hostinger Node.js app');
console.log('   4. Deploy! 🚀\n');

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

