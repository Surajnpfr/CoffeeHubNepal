# Docker Deployment Troubleshooting

## Issue: Port 4000 Already in Use

**Error Message:**
```
failed to bind host port 0.0.0.0:4000/tcp: address already in use
```

### Solutions:

#### Solution 1: Stop Existing Container (Recommended)

If you have a previous container running, stop it first:

```bash
# List running containers
docker ps

# Stop the container using port 4000
docker stop coffeehubnepal

# Or remove it completely
docker rm -f coffeehubnepal

# Then restart
docker-compose up -d
```

#### Solution 2: Change the Port

If port 4000 is used by another service, change it in `docker-compose.yml`:

```yaml
ports:
  - "3000:4000"  # Use port 3000 on host, 4000 in container
```

Or use a different port like 5000, 8000, etc.

#### Solution 3: On Hosting Platforms

Some hosting platforms (like Hostinger) manage ports automatically. You may need to:

1. **Remove the port mapping** and let the platform assign it:
   ```yaml
   # Remove or comment out the ports section
   # ports:
   #   - "4000:4000"
   ```

2. **Use the platform's port assignment** - Check your hosting platform's documentation for how they handle Docker port mappings.

3. **Set PORT environment variable** - Some platforms set this automatically.

## Issue: Missing Environment Variables

**Warning Messages:**
```
The "MONGO_URI" variable is not set. Defaulting to a blank string.
The "JWT_SECRET" variable is not set. Defaulting to a blank string.
```

### Solution:

You **MUST** set these environment variables in your hosting platform:

1. **MONGO_URI** - Your MongoDB connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/coffeehubnepal`

2. **JWT_SECRET** - A secure random string (minimum 32 characters)
   - Generate with: `openssl rand -hex 32`
   - Or use an online generator

3. **CLIENT_ORIGIN** - Your domain URL
   - Example: `https://yourdomain.com`

### How to Set Environment Variables:

**On Hostinger:**
1. Go to Docker Manager
2. Select your container
3. Go to Environment Variables section
4. Add each variable:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your generated secret
   - `CLIENT_ORIGIN` = your domain URL
   - `NODE_ENV` = `production`
   - `PORT` = `4000`

**Using docker-compose with .env file:**
1. Copy `docker.env.example` to `.env`
2. Fill in your values
3. Run: `docker-compose up -d`

## Issue: Container Won't Start

### Check Logs:
```bash
docker logs coffeehubnepal
```

### Common Issues:

1. **Database Connection Failed**
   - Verify `MONGO_URI` is correct
   - Check MongoDB network access (whitelist IPs)
   - Ensure database exists

2. **Missing Dependencies**
   - Rebuild: `docker-compose up -d --build`

3. **Permission Issues**
   - Check file permissions
   - Ensure Docker has proper access

## Health Check

Test if your container is running:

```bash
# Check container status
docker ps

# Test health endpoint
curl http://localhost:4000/health
# Should return: {"status":"ok"}
```

## Quick Fix Commands

```bash
# Stop and remove existing container
docker-compose down

# Remove old images (optional)
docker system prune -a

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f
```

