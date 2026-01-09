# Password Reset Email Setup Guide

This guide will help you configure email sending for the password reset feature in CoffeeHubNepal.

## Overview

The password reset feature uses SMTP (Simple Mail Transfer Protocol) to send password reset emails to users. You can use any SMTP-compatible email service provider.

## Quick Start

1. Choose an email service provider (see options below)
2. Get your SMTP credentials
3. Add credentials to your `.env` file
4. Test the setup

## Email Service Providers

### Option 1: Azure Communication Services Email (Recommended if using Azure)

If you're already using Azure Cosmos DB, Azure Communication Services Email integrates seamlessly with your existing Azure infrastructure.

**Pros:**
- Integrated with Azure ecosystem
- Free tier: 50 emails/day
- Pay-as-you-go pricing
- Good for Azure-based applications

**Cons:**
- Requires Azure account
- Domain verification needed for production

See detailed setup instructions below.

---

### Option 2: Gmail (Recommended for Development)

Gmail is free and easy to set up for development/testing purposes.

#### Steps:

1. **Enable 2-Step Verification** (if not already enabled)
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "CoffeeHubNepal" as the name
   - Click "Generate"
   - **Copy the 16-character password** (you'll need this)

3. **Add to `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=noreply@coffeehubnepal.com
   RESET_TOKEN_EXPIRY_HOURS=1
   ```

**Note:** Replace `your-email@gmail.com` with your actual Gmail address and `your-16-character-app-password` with the app password you generated.

---

### Option 3: SendGrid (Recommended for Production)

SendGrid offers a free tier (100 emails/day) and is reliable for production use.

#### Steps:

1. **Sign up for SendGrid**
   - Go to [SendGrid](https://sendgrid.com/)
   - Create a free account

2. **Create API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it "CoffeeHubNepal Password Reset"
   - Select "Restricted Access" → "Mail Send" → "Full Access"
   - Click "Create & View"
   - **Copy the API key** (you'll only see it once!)

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Verify a Single Sender (for testing) or Domain (for production)
   - Use the verified email as `SMTP_FROM`

4. **Add to `.env` file:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=your-verified-email@yourdomain.com
   RESET_TOKEN_EXPIRY_HOURS=1
   ```

**Note:** For SendGrid, `SMTP_USER` is always `apikey`, and `SMTP_PASS` is your API key.

---

### Option 3: Azure Communication Services Email

Azure Communication Services Email is a good choice if you're already using Azure services (like Azure Cosmos DB).

#### Steps:

1. **Create Azure Communication Services Resource**
   - Go to [Azure Portal](https://portal.azure.com/)
   - Click "Create a resource"
   - Search for "Communication Services"
   - Click "Create"
   - Fill in:
     - **Resource Group**: Create new or use existing
     - **Resource Name**: e.g., `coffeehubnepal-email`
     - **Data Location**: Choose closest to your users
   - Click "Review + create" → "Create"

2. **Get Connection String**
   - Go to your Communication Services resource
   - Navigate to "Keys" in the left sidebar
   - Copy the **Connection String** (starts with `endpoint=https://...`)

3. **Verify Domain/Email**
   - Go to "Email" → "Domains" in your Communication Services resource
   - Click "Add domain" or "Add email address"
   - For testing: Verify a single email address
   - For production: Verify your domain (requires DNS records)

4. **Install Azure SDK** (if not using SMTP)
   ```bash
   npm install @azure/communication-email
   ```

5. **Alternative: Use SMTP** (Simpler)
   - Azure Communication Services also provides SMTP access
   - Go to "Email" → "SMTP Settings" in your resource
   - Copy the SMTP credentials:
     - **SMTP Host**: `smtp.azurecomm.net`
     - **SMTP Port**: `587`
     - **Username**: Your connection string endpoint
     - **Password**: Your connection string access key

6. **Add to `.env` file:**
   ```env
   SMTP_HOST=smtp.azurecomm.net
   SMTP_PORT=587
   SMTP_USER=your-endpoint-from-connection-string
   SMTP_PASS=your-access-key-from-connection-string
   SMTP_FROM=your-verified-email@yourdomain.com
   RESET_TOKEN_EXPIRY_HOURS=1
   ```

**Note:** Azure Communication Services Email has a free tier (50 emails/day) and paid plans for higher volumes.

**Pricing:** Pay-as-you-go pricing. Check [Azure Pricing](https://azure.microsoft.com/pricing/details/communication-services/) for current rates.

---

### Option 4: AWS SES (Amazon Simple Email Service)

AWS SES is cost-effective for high-volume email sending.

#### Steps:

1. **Set up AWS SES**
   - Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
   - Verify your email address or domain
   - Move out of sandbox mode (if needed for production)

2. **Get SMTP Credentials**
   - Go to SMTP Settings in SES Console
   - Click "Create SMTP Credentials"
   - Download the credentials file

3. **Add to `.env` file:**
   ```env
   SMTP_HOST=email-smtp.region.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   SMTP_FROM=your-verified-email@yourdomain.com
   RESET_TOKEN_EXPIRY_HOURS=1
   ```

**Note:** Replace `region` with your AWS region (e.g., `us-east-1`, `eu-west-1`).

---

### Option 5: Custom SMTP Server

If you have your own SMTP server or use another provider:

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
RESET_TOKEN_EXPIRY_HOURS=1
```

**Common SMTP Ports:**
- `587` - TLS/STARTTLS (recommended)
- `465` - SSL/TLS
- `25` - Plain (often blocked by ISPs)

---

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` | Yes |
| `SMTP_PORT` | SMTP server port | `587` | Yes |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` | Yes |
| `SMTP_PASS` | SMTP password/API key | `your-password` | Yes |
| `SMTP_FROM` | Sender email address | `noreply@coffeehubnepal.com` | Yes |
| `RESET_TOKEN_EXPIRY_HOURS` | Token expiration time | `1` | No (default: 1) |

---

## Testing the Setup

### Development Mode (No SMTP Configured)

If SMTP credentials are not configured, the system will log reset links to the console instead of sending emails. This is useful for development.

**Example console output:**
```
=== PASSWORD RESET LINK (Development Mode) ===
Email: user@example.com
Reset Link: http://localhost:5173/reset-password?token=eyJhbGc...
===============================================
```

### Production Mode (SMTP Configured)

1. **Start the backend server:**
   ```bash
   cd apps/api
   npm run dev
   ```

2. **Test password reset:**
   - Go to the login page
   - Click "Forgot Password?"
   - Enter a registered email address
   - Check your email inbox (and spam folder)
   - Click the reset link in the email
   - Set a new password

3. **Check server logs:**
   ```
   [Email Service] Password reset email sent to user@example.com
   [Auth Service] Password reset email sent to user@example.com
   ```

---

## Troubleshooting

### Issue: "Failed to send password reset email"

**Possible causes:**
1. **Incorrect SMTP credentials** - Double-check your `.env` file
2. **Firewall blocking port** - Ensure port 587 or 465 is open
3. **2FA not enabled (Gmail)** - Gmail requires app passwords, not regular passwords
4. **Account restrictions** - Some providers require account verification first

**Solutions:**
- Verify all environment variables are set correctly
- Test SMTP connection using a tool like [Mailtrap](https://mailtrap.io/) or [Ethereal Email](https://ethereal.email/)
- Check server logs for detailed error messages
- Ensure your email provider allows SMTP access

### Issue: Emails going to spam

**Solutions:**
- Use a verified sender email address
- Set up SPF, DKIM, and DMARC records (for custom domains)
- Use a reputable email service provider (SendGrid, AWS SES)
- Avoid spam trigger words in email content

### Issue: "Too many requests" error

**Cause:** Rate limiting is working (3 requests per hour per IP)

**Solution:** Wait before requesting another password reset, or use a different IP address

### Issue: Reset link not working

**Possible causes:**
1. **Token expired** - Reset links expire after 1 hour (configurable)
2. **Token already used** - Reset tokens are one-time use only
3. **Invalid token** - Token may have been corrupted

**Solution:** Request a new password reset link

---

## Security Best Practices

1. **Never commit `.env` file** - Keep credentials secure
2. **Use app passwords** - Don't use your main account password
3. **Rotate credentials** - Change passwords/API keys periodically
4. **Monitor email sending** - Watch for unusual activity
5. **Rate limiting** - Already implemented (3 requests/hour)
6. **Token expiration** - Tokens expire after 1 hour by default

---

## Production Checklist

Before deploying to production:

- [ ] SMTP credentials configured in production environment
- [ ] Sender email address verified with email provider
- [ ] SPF/DKIM records set up (for custom domains)
- [ ] Email templates reviewed and customized
- [ ] Rate limiting tested
- [ ] Error handling tested
- [ ] Email delivery monitored
- [ ] Backup email service configured (optional)

---

## Example `.env` File

```env
# Database
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret

# Server
PORT=4000
CLIENT_ORIGIN=https://yourdomain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@coffeehubnepal.com
RESET_TOKEN_EXPIRY_HOURS=1

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
LOCKOUT_THRESHOLD=5
LOCKOUT_WINDOW_MINUTES=15
```

---

## Need Help?

If you encounter issues:

1. Check server logs for error messages
2. Verify all environment variables are set
3. Test SMTP connection independently
4. Check email provider documentation
5. Review the troubleshooting section above

For more information, see the main [README.md](./README.md) file.

