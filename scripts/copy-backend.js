import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const apiSrc = path.join(projectRoot, 'apps', 'api', 'src');
const apiDist = path.join(projectRoot, 'apps', 'api', 'dist');
const apiRoot = path.join(projectRoot, 'apps', 'api');
const webDist = path.join(projectRoot, 'apps', 'web', 'dist');
const deployBackend = path.join(projectRoot, 'deploy', 'backend');

// Create deploy/backend directory if it doesn't exist
if (!fs.existsSync(path.join(projectRoot, 'deploy'))) {
  fs.mkdirSync(path.join(projectRoot, 'deploy'), { recursive: true });
}
if (!fs.existsSync(deployBackend)) {
  fs.mkdirSync(deployBackend, { recursive: true });
}

// Files to copy
const filesToCopy = [
  'package.json',
  'tsconfig.json',
  'README.md'
];

// Directories to copy
const dirsToCopy = [
  'dist'
];

console.log('📦 Copying backend build to deploy/backend...');

// Clear existing deploy/backend
if (fs.existsSync(deployBackend)) {
  fs.rmSync(deployBackend, { recursive: true, force: true });
}
fs.mkdirSync(deployBackend, { recursive: true });

// Copy files
filesToCopy.forEach(file => {
  const src = path.join(apiRoot, file);
  const dest = path.join(deployBackend, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const src = path.join(apiRoot, dir);
  const dest = path.join(deployBackend, dir);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, dest);
    console.log(`✅ Copied ${dir}/`);
  }
});

// Copy ENV_TEMPLATE.txt
const envTemplate = path.join(projectRoot, 'deploy', 'ENV_TEMPLATE.txt');
const envTemplateDest = path.join(deployBackend, 'ENV_TEMPLATE.txt');
if (fs.existsSync(envTemplate)) {
  fs.copyFileSync(envTemplate, envTemplateDest);
  console.log('✅ Copied ENV_TEMPLATE.txt');
}

// Copy React build files to public folder (for combined Node.js deployment)
const publicDest = path.join(deployBackend, 'public');
if (fs.existsSync(webDist)) {
  copyRecursiveSync(webDist, publicDest);
  console.log('✅ Copied React build to public/ folder');
} else {
  console.warn('⚠️  Warning: React build not found. Run npm run build:frontend first if you need static files.');
}

// Copy server.js if it exists in deploy/backend
const serverJs = path.join(projectRoot, 'deploy', 'backend', 'server.js');
if (fs.existsSync(serverJs)) {
  const serverJsDest = path.join(deployBackend, 'server.js');
  fs.copyFileSync(serverJs, serverJsDest);
  console.log('✅ Copied server.js');
}

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

// Update package.json start script to use dist/server.js
const packageJsonPath = path.join(deployBackend, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.start = 'node dist/server.js';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json start script');
}

console.log('✅ Backend build copied successfully!');
console.log('📝 Remember to:');
console.log('   1. Copy ENV_TEMPLATE.txt to .env in deploy/backend/');
console.log('   2. Fill in all environment variables');
console.log('   3. Run npm install --production in deploy/backend/');

