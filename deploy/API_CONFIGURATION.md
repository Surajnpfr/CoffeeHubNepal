# API Configuration Guide

## Overview

The CoffeeHubNepal frontend communicates with the backend API. The API URL is configured at **build time** using the `VITE_API_URL` environment variable.

## Current Configuration

By default, the frontend is built with:
```javascript
API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
```

This means:
- If `VITE_API_URL` is not set during build, it defaults to `http://localhost:4000`
- The API URL is **baked into the compiled JavaScript** during the build process
- You cannot change the API URL after the build without rebuilding

## Configuration Options

### Option 1: Rebuild Frontend with API URL (Recommended)

If your API is hosted on a different domain/subdomain, rebuild the frontend with the correct API URL:

1. **Set the environment variable before building:**
   ```bash
   # Windows (PowerShell)
   $env:VITE_API_URL="https://api.yourdomain.com"
   npm run build:deploy
   
   # Windows (CMD)
   set VITE_API_URL=https://api.yourdomain.com
   npm run build:deploy
   
   # Linux/Mac
   export VITE_API_URL=https://api.yourdomain.com
   npm run build:deploy
   ```

2. **Or create a `.env` file in `apps/web/`:**
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```
   Then run `npm run build:deploy` from the project root.

3. **Recreate the Hostinger folder:**
   ```bash
   npm run create:hostinger
   ```

### Option 2: Use Same Domain with Path (No Rebuild Needed)

If your API is on the same domain under `/api` path:

1. Configure your Hostinger server to proxy API requests
2. Set up reverse proxy rules in `.htaccess` or server configuration
3. Frontend will work with relative URLs (if configured)

### Option 3: CORS Configuration (If API is on Different Domain)

If your API is on a different domain and you've already deployed:

1. **Backend CORS Configuration:**
   - Ensure `CLIENT_ORIGIN` in backend `.env` matches your frontend domain
   - Example: `CLIENT_ORIGIN=https://yourdomain.com`

2. **Rebuild frontend** with the correct API URL (Option 1) for best results

## Common Deployment Scenarios

### Scenario 1: API on Subdomain
- Frontend: `https://yourdomain.com`
- API: `https://api.yourdomain.com`

**Solution:** Rebuild frontend with:
```bash
VITE_API_URL=https://api.yourdomain.com npm run build:deploy
```

### Scenario 2: API on Same Domain
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api`

**Solution:** 
- Configure reverse proxy in Hostinger
- Or rebuild frontend with: `VITE_API_URL=https://yourdomain.com/api`

### Scenario 3: API on Different Port (Not Recommended for Production)
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com:4000`

**Solution:** Rebuild frontend with:
```bash
VITE_API_URL=https://yourdomain.com:4000 npm run build:deploy
```

## Verifying API Configuration

After deployment, check the browser console:

1. Open your deployed website
2. Open Developer Tools (F12)
3. Go to Network tab
4. Try to log in or make an API call
5. Check if requests go to the correct API URL

If you see requests to `http://localhost:4000`, the frontend was built with the default URL and needs to be rebuilt.

## Troubleshooting

### Problem: API calls fail with CORS error
- **Solution:** Check `CLIENT_ORIGIN` in backend `.env` matches your frontend domain

### Problem: API calls go to localhost
- **Solution:** Frontend was built with default URL. Rebuild with `VITE_API_URL` set

### Problem: API calls fail with 404
- **Solution:** Verify API URL is correct and API is running on that URL

### Problem: API works in development but not production
- **Solution:** Development uses `http://localhost:4000`. Production needs the actual API URL. Rebuild frontend.

## Quick Reference

```bash
# Build with custom API URL
VITE_API_URL=https://api.yourdomain.com npm run build:deploy

# Then create Hostinger folder
npm run create:hostinger
```

## Important Notes

- The API URL is **static** in the built frontend
- You **must rebuild** the frontend to change the API URL
- Always test API connectivity after deployment
- Keep `CLIENT_ORIGIN` in backend `.env` synchronized with your frontend domain

