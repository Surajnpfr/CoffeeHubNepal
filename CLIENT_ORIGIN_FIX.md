# Fix CLIENT_ORIGIN for IP Address Access

## Problem

Your app works at `coffeehub.hamroniti.com` but you're accessing via `http://72.61.229.21:3000/`.

The password reset email links use `CLIENT_ORIGIN`, so they might point to the wrong URL.

## Solution: Update CLIENT_ORIGIN Environment Variable

### On Your Hosting Platform:

1. **Go to Container Settings → Environment Variables**
2. **Update `CLIENT_ORIGIN`:**

   **Option A: Use Domain (Recommended)**
   ```
   CLIENT_ORIGIN=https://coffeehub.hamroniti.com
   ```
   Or if using HTTP:
   ```
   CLIENT_ORIGIN=http://coffeehub.hamroniti.com:3000
   ```

   **Option B: Use IP Address (If needed)**
   ```
   CLIENT_ORIGIN=http://72.61.229.21:3000
   ```

3. **Restart the container**

## Important Notes

1. **Password reset links** will point to whatever `CLIENT_ORIGIN` is set to
2. **CORS** is also controlled by `CLIENT_ORIGIN` - API requests must come from this origin
3. **Best practice**: Use your domain name, not IP address

## Recommended Setup

```
CLIENT_ORIGIN=https://coffeehub.hamroniti.com
```

Then access your app at: `https://coffeehub.hamroniti.com` (or with port if needed)

## Why Use Domain Instead of IP?

- ✅ More professional
- ✅ Works with SSL certificates
- ✅ Easier to remember
- ✅ Better for email links
- ✅ Works with Azure email verification

## After Updating

1. Restart container
2. Try password reset again
3. Check the reset link in the email - it should match your `CLIENT_ORIGIN`

