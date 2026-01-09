# CAPTCHA Setup Guide

This guide explains how to configure Cloudflare Turnstile CAPTCHA for the login page.

## Overview

The application uses Cloudflare Turnstile for CAPTCHA verification on the login page. This provides bot protection without requiring users to solve puzzles.

## Setup Steps

### 1. Create Cloudflare Turnstile Account

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** section
3. Create a new site
4. Choose your domain (or use "localhost" for development)
5. Copy your **Site Key** and **Secret Key**

### 2. Configure Frontend (Web App)

Add the site key to your frontend environment variables:

**Create or update `apps/web/.env`:**
```env
VITE_TURNSTILE_SITE_KEY=your_site_key_here
```

**For production, add to your deployment environment:**
- VPS: Add to `/var/www/coffeehubnepal/backend/.env` (if using same domain)
- Or set in your hosting platform's environment variables

### 3. Configure Backend (API)

Add the secret key to your backend environment variables:

**Update `apps/api/.env`:**
```env
CAPTCHA_SECRET=your_secret_key_here
```

**For production (VPS):**
Update `/var/www/coffeehubnepal/backend/.env`:
```env
CAPTCHA_SECRET=your_secret_key_here
```

### 4. How It Works

1. **Frontend**: The login page displays a Turnstile widget when `VITE_TURNSTILE_SITE_KEY` is set
2. **User Interaction**: User completes the CAPTCHA (usually automatic/invisible)
3. **Token Generation**: Turnstile generates a verification token
4. **API Request**: Token is sent to backend in `x-captcha-token` header
5. **Backend Verification**: Backend verifies token with Cloudflare's API
6. **Login Proceeds**: If verification succeeds, login continues

### 5. Testing

**Development:**
- Set `VITE_TURNSTILE_SITE_KEY` in `apps/web/.env`
- Set `CAPTCHA_SECRET` in `apps/api/.env`
- Restart both frontend and backend servers
- Visit login page - CAPTCHA should appear

**Production:**
- Ensure both environment variables are set
- Restart backend service (PM2)
- Clear browser cache if needed
- Test login flow

### 6. Disabling CAPTCHA

To disable CAPTCHA (not recommended for production):

**Frontend:**
- Remove or comment out `VITE_TURNSTILE_SITE_KEY` from `.env`
- Restart frontend server

**Backend:**
- Remove or comment out `CAPTCHA_SECRET` from `.env`
- Restart backend server

When disabled, the CAPTCHA widget won't appear and verification is skipped.

## Troubleshooting

### CAPTCHA Not Appearing

1. Check `VITE_TURNSTILE_SITE_KEY` is set correctly
2. Verify the site key matches your Cloudflare Turnstile configuration
3. Check browser console for errors
4. Ensure domain matches Turnstile site configuration

### CAPTCHA Verification Failing

1. Check `CAPTCHA_SECRET` is set correctly in backend
2. Verify secret key matches your Cloudflare Turnstile configuration
3. Check backend logs for verification errors
4. Ensure backend can reach `challenges.cloudflare.com`

### Common Errors

- **CAPTCHA_REQUIRED**: Token not sent (check frontend is sending header)
- **CAPTCHA_INVALID**: Token verification failed (check secret key)
- **CAPTCHA_VERIFICATION_FAILED**: Network error (check backend connectivity)

## Security Notes

- Never commit `.env` files with secrets
- Use different keys for development and production
- Rotate keys periodically
- Monitor Cloudflare dashboard for abuse patterns

## Additional Resources

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Turnstile API Reference](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

