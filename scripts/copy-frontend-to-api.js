import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../apps/web/dist');
const destDir = path.join(__dirname, '../apps/api/public');

// Remove existing public folder
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true });
}

// Copy frontend build to API public folder
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcDir)) {
  copyDir(srcDir, destDir);
  console.log('✅ Frontend build copied to apps/api/public');
} else {
  console.error('❌ Frontend build not found at', srcDir);
  process.exit(1);
}

