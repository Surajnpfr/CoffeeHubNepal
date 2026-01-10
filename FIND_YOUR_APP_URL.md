# Where is Your Application Hosted?

## ✅ Deployment Successful!

Your container is running! Now you need to find the URL.

## How to Find Your Application URL

### On Hostinger (Most Likely):

1. **Log in to Hostinger Control Panel**
2. **Go to Docker Manager** or **Container Manager**
3. **Find your container** (`coffeehubnepal`)
4. **Look for:**
   - **Container URL** or **Endpoint**
   - **Access URL**
   - **Public URL**
   - **Port Mapping** (shows the port number)

5. **Common locations:**
   - Container details page
   - Overview/Dashboard
   - Networking/Ports section

### The URL Format Will Be:

```
http://your-domain.com:PORT
```

Or if using a subdomain:
```
http://docker.your-domain.com
http://app.your-domain.com
```

### Check Container Logs:

In your hosting platform, view the container logs. You should see:
```
Server running on port 4000
```

This confirms the app is running inside the container.

## Important: Set Environment Variables!

⚠️ **You still need to set environment variables!** The warnings show:
- `MONGO_URI` is not set
- `JWT_SECRET` is not set

**Without these, your app won't work properly!**

### Steps:

1. **Go to Container Settings → Environment Variables**
2. **Add:**
   ```
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/coffeehubnepal
   JWT_SECRET = your-generated-secret-here
   CLIENT_ORIGIN = https://your-domain.com
   NODE_ENV = production
   PORT = 4000
   ```
3. **Restart the container**

## Test Your Application

Once you have the URL:

1. **Health Check:**
   ```
   http://your-url/health
   ```
   Should return: `{"status":"ok"}`

2. **Homepage:**
   ```
   http://your-url
   ```
   Should show your CoffeeHubNepal website

3. **API Test:**
   ```
   http://your-url/auth/login
   ```
   Should return an API response (not 404)

## If You Can't Find the URL

### Option 1: Check Your Domain
- If you have a domain connected, it might be:
  - `http://yourdomain.com:3000`
  - `http://yourdomain.com:5000`
  - Or a subdomain like `http://app.yourdomain.com`

### Option 2: Check Hosting Platform Dashboard
- Look for "Container URL" or "Access URL"
- Check the "Networking" or "Ports" section
- Some platforms show it in the container overview

### Option 3: Contact Support
- If you can't find it, check your hosting platform's documentation
- Or contact their support for help finding the container URL

## Common Hosting Platforms

### Hostinger:
- Go to: **hPanel → Docker Manager → Your Container**
- Look for: **Container URL** or **Access URL**

### Railway:
- Go to: **Project → Your Service**
- Find: **Public URL** or **Domain**

### Render:
- Go to: **Dashboard → Your Service**
- Find: **URL** at the top

### DigitalOcean:
- Go to: **Apps → Your App**
- Find: **Live App URL**

## Next Steps

1. ✅ **Find your application URL** (from hosting platform)
2. ⚠️ **Set environment variables** (MONGO_URI, JWT_SECRET, etc.)
3. ✅ **Restart container** (after setting env vars)
4. ✅ **Test the application** (visit the URL)
5. ✅ **Check logs** (if something doesn't work)

