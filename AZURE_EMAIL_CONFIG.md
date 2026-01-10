# Azure Email Configuration - Correct Format

## ❌ Current Problem

Your `SMTP_USER` contains the endpoint URL with an access key mixed in:
```
https://mailingservices.india.communication.azure.com/YOUR_ACCESS_KEY_HERE
```

## ✅ Correct Format

The endpoint URL and access key must be **separated**:

### Environment Variables:

```
SMTP_HOST=smtp.azurecomm.net
SMTP_PORT=587
SMTP_USER=https://mailingservices.india.communication.azure.com/
SMTP_PASS=YOUR_ACCESS_KEY_HERE
SMTP_FROM=DoNotReply@coffeehubnepal.com
```

### Key Points:

1. **SMTP_USER** = Just the endpoint URL (ends with `/`)
   - ✅ Correct: `https://mailingservices.india.communication.azure.com/`
   - ❌ Wrong: `https://mailingservices.india.communication.azure.com/5atbfOs3...`

2. **SMTP_PASS** = Just the access key
   - ✅ Correct: `YOUR_ACCESS_KEY_HERE` (get from Azure Portal → Keys)

## How to Get the Correct Values

### Step 1: Get Endpoint URL

1. Go to **Azure Portal**
2. Navigate to your **Communication Services** resource
3. Go to **"Keys"** in the left sidebar
4. Find the **Connection String** (looks like: `endpoint=https://...;accesskey=...`)
5. Extract the endpoint part (everything before `;accesskey=`)
   - Example: `endpoint=https://mailingservices.india.communication.azure.com/`
   - Remove `endpoint=` prefix
   - Use: `https://mailingservices.india.communication.azure.com/`

### Step 2: Get Access Key

1. In the same **"Keys"** section
2. Copy the **PRIMARY KEY** or **SECONDARY KEY**
3. This is your `SMTP_PASS`

### Step 3: Update Environment Variables

**On your hosting platform:**

1. Go to **Container Settings → Environment Variables**
2. Update:
   ```
   SMTP_USER = https://mailingservices.india.communication.azure.com/
   SMTP_PASS = your-access-key-here
   ```
3. **Restart the container**

## Alternative: Use Full Connection String

If you prefer, you can use the full connection string:

```
SMTP_USER=endpoint=https://mailingservices.india.communication.azure.com/;accesskey=YOUR_ACCESS_KEY
SMTP_PASS=  (can be empty or same as access key)
```

But the separated format (above) is recommended.

## Verify Configuration

After updating, check the logs. You should see:
```
[Email Service] Extracted base endpoint: https://mailingservices.india.communication.azure.com/
[Email Service] Creating Azure Email Client
```

And no more "Invalid endpoint url" errors!

## Still Having Issues?

1. **Verify sender email** in Azure (see `AZURE_EMAIL_FIX.md`)
2. **Check access key** is correct (regenerate if needed)
3. **Ensure endpoint URL** ends with `/`
4. **Restart container** after changes

