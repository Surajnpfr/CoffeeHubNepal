# Docker Deployment Guide for CoffeeHubNepal

This guide explains how to build and deploy CoffeeHubNepal using Docker with GitHub Actions.

## 🚀 Quick Start with GitHub Actions (Recommended)

**No Docker installation needed!** GitHub Actions will build and push your Docker image automatically.

### Step 1: Push to GitHub

1. Commit and push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Docker support"
   git push origin main
   ```

2. The GitHub Actions workflow (`.github/workflows/docker-build.yml`) will automatically:
   - Build the Docker image
   - Push it to GitHub Container Registry (GHCR)
   - Tag it as `latest` on the main branch

### Step 2: View Your Image

1. Go to your GitHub repository
2. Click on **Packages** (right sidebar)
3. You'll see your Docker image: `ghcr.io/your-username/your-repo`

### Step 3: Pull and Run the Image

On any server with Docker installed:

```bash
# Login to GitHub Container Registry (first time only)
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/your-username/your-repo:latest

# Run the container
docker run -d \
  --name coffeehubnepal \
  -p 4000:4000 \
  -e MONGO_URI=your_mongodb_connection_string \
  -e JWT_SECRET=your_jwt_secret \
  -e PORT=4000 \
  -e NODE_ENV=production \
  -e CLIENT_ORIGIN=https://yourdomain.com \
  ghcr.io/your-username/your-repo:latest
```

### Step 4: Access Your Application

- **Web App**: `http://localhost:4000` (or your domain)
- **API Health**: `http://localhost:4000/health`
- **API Routes**: `http://localhost:4000/auth`, `/blog`, `/admin`

## 📦 Local Docker Build (Optional)

If you want to build locally, you need Docker Desktop installed first.

### Install Docker Desktop for Windows

1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Verify installation:
   ```powershell
   docker --version
   ```

### Build Locally

```powershell
# Build the image
docker build -t coffeehubnepal:latest .

# Run the container
docker run -d `
  --name coffeehubnepal `
  -p 4000:4000 `
  -e MONGO_URI=your_mongodb_uri `
  -e JWT_SECRET=your_jwt_secret `
  -e PORT=4000 `
  coffeehubnepal:latest
```

## 🔧 Environment Variables

Required environment variables for the container:

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/coffeehubnepal

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Server
PORT=4000
NODE_ENV=production

# CORS
CLIENT_ORIGIN=https://yourdomain.com

# Email (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@coffeehubnepal.com

# Rate Limiting (Optional)
RATE_LIMIT_PER_MINUTE=60
LOCKOUT_THRESHOLD=5
LOCKOUT_WINDOW_MINUTES=15

# CAPTCHA (Optional)
CAPTCHA_SECRET=your-turnstile-secret
```

## 🐳 Docker Compose (Recommended for Local Development)

A `docker-compose.yml` file is included in the repository for easy management.

### Quick Start with Docker Compose

1. **Copy environment template:**
   ```powershell
   copy docker.env.example .env
   ```

2. **Edit `.env` file** and fill in your values:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string (generate with: `openssl rand -hex 32`)
   - `CLIENT_ORIGIN` - Your domain URL (e.g., `https://yourdomain.com`)

3. **Build and start:**
   ```powershell
   docker-compose up -d
   ```

4. **View logs:**
   ```powershell
   docker-compose logs -f
   ```

5. **Stop the application:**
   ```powershell
   docker-compose down
   ```

6. **Rebuild after code changes:**
   ```powershell
   docker-compose up -d --build
   ```

### Using Pre-built Image from GitHub

If you want to use the image from GitHub Container Registry instead of building locally:

Edit `docker-compose.yml` and change:
```yaml
build:
  context: .
  dockerfile: Dockerfile
```

To:
```yaml
image: ghcr.io/your-username/your-repo:latest
```

Then run:
```powershell
docker-compose pull
docker-compose up -d
```

## 🌐 Deploy to Cloud Platforms

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Railway will detect the Dockerfile automatically
3. Add environment variables in Railway dashboard
4. Deploy!

### Deploy to Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set:
   - **Build Command**: (leave empty, Docker handles it)
   - **Start Command**: (leave empty, Docker handles it)
   - **Dockerfile Path**: `./Dockerfile`
4. Add environment variables
5. Deploy!

### Deploy to DigitalOcean App Platform

1. Create a new App
2. Connect GitHub repository
3. Select "Dockerfile" as build method
4. Add environment variables
5. Deploy!

## 📝 GitHub Actions Workflow

The workflow (`.github/workflows/docker-build.yml`) automatically:
- ✅ Builds on push to main/master
- ✅ Builds on pull requests (without pushing)
- ✅ Builds on version tags (v1.0.0, etc.)
- ✅ Pushes to GHCR with proper tags
- ✅ Uses build cache for faster builds

## 🔍 Troubleshooting

### Image not found in GHCR
- Make sure you've pushed to GitHub
- Check Actions tab for build errors
- Verify package visibility settings in GitHub

### Container won't start
- Check logs: `docker logs coffeehubnepal`
- Verify environment variables are set
- Ensure MongoDB URI is correct

### Port already in use
- Change port mapping: `-p 3000:4000` (host:container)
- Or stop the service using port 4000

### Health check failing
- Wait 40 seconds after container starts (start period)
- Check if API is responding: `curl http://localhost:4000/health`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions](https://docs.github.com/en/actions)

