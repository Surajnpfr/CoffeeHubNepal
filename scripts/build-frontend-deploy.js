import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const webDir = path.join(projectRoot, 'apps', 'web');

console.log('📦 Building frontend for deployment (with relative API URLs)...\n');

// Set VITE_API_URL to empty string for relative URLs (same domain deployment)
// This works cross-platform
process.env.VITE_API_URL = '';

try {
  // Install dependencies
  console.log('📥 Installing dependencies...');
  execSync('npm install --include=dev', {
    cwd: webDir,
    stdio: 'inherit'
  });

  // Build
  console.log('\n🔨 Building frontend...');
  execSync('npm run build', {
    cwd: webDir,
    stdio: 'inherit',
    env: { ...process.env, VITE_API_URL: '' }
  });

  // Copy to deploy folder
  console.log('\n📋 Copying to deploy folder...');
  const copyScript = path.join(projectRoot, 'scripts', 'copy-frontend.js');
  execSync(`node "${copyScript}"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  console.log('\n✅ Frontend build completed with relative API URLs!');
  console.log('   API calls will use same domain (no CORS needed)');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}

