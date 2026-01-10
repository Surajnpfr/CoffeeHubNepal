# Where to Put Environment Variables

## Option 1: On Your Hosting Platform (Hostinger/Cloud Platforms) ⭐ RECOMMENDED

Since you're deploying on a hosting platform, set environment variables in the platform's UI:

### Steps for Hostinger:

1. **Log in to Hostinger Control Panel**
2. **Go to Docker Manager** (or Container Manager)
3. **Select your container** (`coffeehubnepal`)
4. **Find "Environment Variables" or "Env" section**
5. **Add these variables one by one:**

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/coffeehubnepal
JWT_SECRET = your-generated-secret-here-min-32-chars
CLIENT_ORIGIN = https://yourdomain.com
NODE_ENV = production
PORT = 4000
```

6. **Save and restart the container**

### For Other Platforms (Railway, Render, DigitalOcean):

- **Railway**: Project → Variables tab → Add variables
- **Render**: Environment → Environment Variables → Add
- **DigitalOcean**: App Settings → App-Level Environment Variables

---

## Option 2: Using .env File (For Local Development)

If you're running locally with `docker-compose`:

1. **Create a `.env` file** in the project root (same folder as `docker-compose.yml`):

```bash
# Copy the example
copy docker.env.example .env
```

2. **Edit `.env` file** and fill in your values:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/coffeehubnepal
JWT_SECRET=your-generated-secret-here
CLIENT_ORIGIN=http://localhost:4000
PORT=4000
NODE_ENV=production
```

3. **Run docker-compose** (it will automatically read `.env`):

```bash
docker-compose up -d
```

**⚠️ Important:** Never commit `.env` to Git! It's already in `.gitignore`.

---

## Option 3: Directly in docker-compose.yml (Not Recommended)

You can hardcode values in `docker-compose.yml`, but **this is NOT secure** for production:

```yaml
environment:
  - MONGO_URI=mongodb+srv://...
  - JWT_SECRET=your-secret
```

**Don't do this** - it exposes secrets in your code!

---

## Required Environment Variables

### Must Have:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/coffeehubnepal` |
| `JWT_SECRET` | Secret for JWT tokens (min 32 chars) | Generate with: `openssl rand -hex 32` |
| `CLIENT_ORIGIN` | Your domain URL | `https://yourdomain.com` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `4000` |

### Optional (but recommended):

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_PER_MINUTE` | API rate limit | `60` |
| `LOCKOUT_THRESHOLD` | Failed login attempts before lockout | `5` |
| `SMTP_HOST` | Email server (for password reset) | - |
| `SMTP_USER` | Email username | - |
| `SMTP_PASS` | Email password | - |
| `CAPTCHA_SECRET` | Cloudflare Turnstile secret | - |

---

## How to Generate JWT_SECRET

**On Windows (PowerShell):**
```powershell
# Generate a secure random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**On Linux/Mac:**
```bash
openssl rand -hex 32
```

**Or use an online generator:**
- https://www.random.org/strings/
- Generate 64+ character random string

---

## Quick Checklist

- [ ] `MONGO_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Generated secure random string (64+ chars)
- [ ] `CLIENT_ORIGIN` - Your domain URL (with https://)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Set to `4000` (or your platform's assigned port)

---

## Testing Your Environment Variables

After setting variables, check if they're loaded:

```bash
# View container environment
docker exec coffeehubnepal env | grep MONGO_URI
docker exec coffeehubnepal env | grep JWT_SECRET
```

Or check logs:
```bash
docker logs coffeehubnepal
```

If you see connection errors, verify your `MONGO_URI` is correct.

