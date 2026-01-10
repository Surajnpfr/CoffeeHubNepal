# Registration/Signup Troubleshooting Guide

## Common Registration Errors

### 1. CAPTCHA_REQUIRED (400)
**Error:** `{ "error": "CAPTCHA_REQUIRED", "code": "CAPTCHA_REQUIRED" }`

**Cause:** CAPTCHA token is missing or not sent in request headers.

**Solution:**
- Ensure frontend sends `x-captcha-token` header
- If CAPTCHA is disabled, send `'captcha-disabled'` as token
- Or remove `CAPTCHA_SECRET` from environment variables to disable CAPTCHA

**Frontend Fix:**
```javascript
// Add CAPTCHA token to request headers
headers: {
  'x-captcha-token': captchaToken, // or 'captcha-disabled'
  'Content-Type': 'application/json'
}
```

---

### 2. CAPTCHA_INVALID (400)
**Error:** `{ "error": "CAPTCHA_INVALID", "code": "CAPTCHA_INVALID" }`

**Cause:** CAPTCHA token is invalid or expired.

**Solution:**
- Regenerate CAPTCHA token on frontend
- Verify CAPTCHA site key matches the secret key
- Check if CAPTCHA token expired (they expire quickly)

---

### 3. ACCOUNT_RATE_LIMITED (429)
**Error:** `{ "error": "ACCOUNT_RATE_LIMITED" }`

**Cause:** Too many signup attempts (5 per minute per email address).

**Solution:**
- Wait 1 minute before trying again
- Use a different email address for testing
- Check rate limit headers in response

---

### 4. VALIDATION_ERROR (400)
**Error:** `{ "error": "VALIDATION_ERROR", "details": {...} }`

**Common Causes:**
- Invalid email format
- Password too short (< 8 characters)
- Password doesn't meet requirements

**Password Requirements:**
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain a number

**Solution:**
- Check the `details` object in error response for specific field errors
- Ensure email is valid format: `user@example.com`
- Use a stronger password

---

### 5. EMAIL_IN_USE (409)
**Error:** `{ "error": "EMAIL_IN_USE", "code": "EMAIL_IN_USE" }`

**Cause:** Email address is already registered.

**Solution:**
- Use a different email address
- Try logging in instead
- Request password reset if you forgot your password

---

### 6. WEAK_PASSWORD (400)
**Error:** `{ "error": "WEAK_PASSWORD", "code": "WEAK_PASSWORD" }`

**Cause:** Password doesn't meet strength requirements.

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

**Solution:**
- Use a stronger password that meets all requirements
- Example: `MyPass123` ✅
- Example: `password` ❌ (no uppercase, no number)

---

### 7. SIGNUP_FAILED (500)
**Error:** `{ "error": "SIGNUP_FAILED" }`

**Cause:** Internal server error (database issue, etc.)

**Solution:**
- Check server logs for detailed error
- Verify MongoDB connection is working
- Check if database has proper permissions
- Try again after a few moments

---

## How to Debug Registration Issues

### Step 1: Check Browser Console
Open browser DevTools (F12) → Console tab
- Look for error messages
- Check network requests to `/auth/signup`

### Step 2: Check Network Request
1. Open DevTools → Network tab
2. Try to register
3. Find the `/auth/signup` request
4. Check:
   - **Request Headers:** Is `x-captcha-token` present?
   - **Request Body:** Are email and password valid?
   - **Response:** What error code/message?

### Step 3: Check Server Logs
On Heroku:
```bash
heroku logs --tail --app your-app-name
```

Look for:
- CAPTCHA errors
- Validation errors
- Database errors
- Rate limiting messages

---

## Quick Fixes

### Disable CAPTCHA (for testing)
Remove or leave empty in environment variables:
```
CAPTCHA_SECRET=
```

### Test with Valid Data
```json
{
  "email": "test@example.com",
  "password": "TestPass123",
  "name": "Test User"
}
```

### Check Rate Limits
- Account rate limit: 5 signups per minute per email
- IP rate limit: 60 requests per minute (default)

---

## Frontend Integration Checklist

- [ ] CAPTCHA token is sent in `x-captcha-token` header
- [ ] Email is valid format
- [ ] Password meets requirements (8+ chars, upper, lower, number)
- [ ] Error messages are displayed to user
- [ ] Rate limiting is handled gracefully
- [ ] Network errors are caught and displayed

---

## Common Frontend Issues

### Missing CAPTCHA Token
```javascript
// ❌ Wrong
fetch('/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// ✅ Correct
fetch('/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-captcha-token': captchaToken // Add this!
  },
  body: JSON.stringify({ email, password })
});
```

### Weak Password
```javascript
// ❌ Weak password
password: "password"

// ✅ Strong password
password: "MySecurePass123"
```

---

## Testing Registration

### Test with cURL
```bash
curl -X POST https://coffeehub.hamroniti.com/auth/signup \
  -H "Content-Type: application/json" \
  -H "x-captcha-token: captcha-disabled" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

### Expected Success Response
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "test@example.com",
    "name": "Test User",
    "role": "farmer",
    "verified": false
  }
}
```

---

## Still Having Issues?

1. **Check Heroku logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Test with cURL** to isolate frontend vs backend issues
4. **Check MongoDB connection** is working
5. **Verify CAPTCHA configuration** if using it

