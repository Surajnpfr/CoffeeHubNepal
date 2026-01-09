import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const webDist = path.join(projectRoot, 'apps', 'web', 'dist');
const deployFrontend = path.join(projectRoot, 'deploy', 'frontend');

// Create deploy/frontend directory if it doesn't exist
if (!fs.existsSync(path.join(projectRoot, 'deploy'))) {
  fs.mkdirSync(path.join(projectRoot, 'deploy'), { recursive: true });
}
if (!fs.existsSync(deployFrontend)) {
  fs.mkdirSync(deployFrontend, { recursive: true });
}

// Copy dist contents to deploy/frontend
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

console.log('📦 Copying frontend build to deploy/frontend...');

if (fs.existsSync(webDist)) {
  // Clear existing deploy/frontend
  if (fs.existsSync(deployFrontend)) {
    fs.rmSync(deployFrontend, { recursive: true, force: true });
  }
  fs.mkdirSync(deployFrontend, { recursive: true });
  
  // Copy dist files
  copyRecursiveSync(webDist, deployFrontend);
  
  // Copy .htaccess
  const htaccessSource = path.join(projectRoot, 'deploy', '.htaccess');
  const htaccessDest = path.join(deployFrontend, '.htaccess');
  if (fs.existsSync(htaccessSource)) {
    fs.copyFileSync(htaccessSource, htaccessDest);
    console.log('✅ Copied .htaccess');
  }
  
  console.log('✅ Frontend build copied successfully!');
} else {
  console.error('❌ Frontend dist folder not found. Run "npm run build" in apps/web first.');
  process.exit(1);
}

