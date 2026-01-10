# Fix Azure Email "Denied by Resource Provider" Error

## Error: 401 - Denied by the resource provider

This error means Azure Communication Services is rejecting your email request. Common causes:

## ✅ Solution 1: Verify Sender Email/Domain in Azure

**This is the most common issue!**

The sender email `DoNotReply@coffeehubnepal.com` must be verified in Azure.

### Steps:

1. **Go to Azure Portal**
   - Navigate to your Communication Services resource
   - Go to **"Email"** → **"Domains"** or **"Email addresses"**

2. **Add and Verify Sender Email:**
   - Click **"Add email address"** (for testing)
   - Enter: `DoNotReply@coffeehubnepal.com`
   - Check your email inbox for verification email
   - Click the verification link

3. **OR Verify Domain (for production):**
   - Click **"Add domain"**
   - Enter: `coffeehubnepal.com`
   - Add the required DNS records (SPF, DKIM, etc.)
   - Wait for verification (can take 24-48 hours)

4. **After verification, restart your container**

---

## ✅ Solution 2: Check Connection String Format

Your `SMTP_USER` should be the **endpoint URL** from Azure.

### Current Format (from logs):
```
SMTP_USER: https://mailingservices.india.communication.azure....
```

### This should work, but verify:

1. **Get the correct connection string from Azure:**
   - Go to Azure Portal → Your Communication Services resource
   - Go to **"Keys"** in the left sidebar
   - Copy the **Connection String** (full string)

2. **Connection String Format:**
   ```
   endpoint=https://your-resource.communication.azure.com/;accesskey=your-access-key
   ```

3. **Set Environment Variables:**
   - **Option A:** Use the full connection string as `SMTP_USER`:
     ```
     SMTP_USER=endpoint=https://mailingservices.india.communication.azure.com/;accesskey=YOUR_KEY
     SMTP_PASS=  (leave empty or set to same key)
     ```
   
   - **Option B:** Split endpoint and access key:
     ```
     SMTP_USER=https://mailingservices.india.communication.azure.com/
     SMTP_PASS=your-access-key-here
     ```

---

## ✅ Solution 3: Verify Access Key

The access key might be incorrect or expired.

### Steps:

1. **Go to Azure Portal → Your Communication Services resource**
2. **Go to "Keys"**
3. **Copy the PRIMARY KEY** (or regenerate if needed)
4. **Update `SMTP_PASS` in your environment variables**
5. **Restart container**

---

## ✅ Solution 4: Check Azure Resource Permissions

Make sure your Azure Communication Services resource has:
- Email sending enabled
- Proper subscription/payment method (if required)
- No restrictions on sending

### Check:
1. Azure Portal → Your Communication Services resource
2. Check **"Overview"** for any warnings
3. Check **"Pricing"** - ensure you have credits/quota
4. Check **"Email"** → **"Settings"** for any restrictions

---

## ✅ Solution 5: Use Correct SMTP_FROM Format

The sender email must match exactly what's verified in Azure.

### Current (from logs):
```
SMTP_FROM=DoNotReply@coffeehubnepal.com
```

### Verify:
1. This email must be verified in Azure (see Solution 1)
2. The format must match exactly (case-sensitive)
3. No extra spaces or special characters

---

## Quick Fix Checklist

- [ ] Sender email `DoNotReply@coffeehubnepal.com` is verified in Azure
- [ ] Connection string/endpoint URL is correct
- [ ] Access key is correct and matches Azure
- [ ] Azure resource has email sending enabled
- [ ] No restrictions on the Azure resource
- [ ] Environment variables are set correctly
- [ ] Container restarted after changes

---

## Alternative: Use SMTP Instead of Azure SDK

If Azure SDK continues to have issues, you can use Azure's SMTP interface:

### Environment Variables:
```
SMTP_HOST=smtp.azurecomm.net
SMTP_PORT=587
SMTP_USER=your-endpoint-hostname  # e.g., mailingservices.india.communication.azure.com
SMTP_PASS=your-access-key
SMTP_FROM=DoNotReply@coffeehubnepal.com
```

This uses standard SMTP instead of the Azure SDK, which can be more reliable.

---

## Test After Fixing

1. **Restart your container**
2. **Try password reset again**
3. **Check logs** - should see success message
4. **Check email inbox** - should receive reset email

---

## Still Not Working?

1. **Check Azure Service Health:** https://status.azure.com/
2. **Review Azure Communication Services logs** in Azure Portal
3. **Try a different verified email** for testing
4. **Contact Azure Support** if resource appears misconfigured

