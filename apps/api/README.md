# CoffeeHubNepal API (Auth)

## Setup
1. Copy `apps/api/env.example` to `.env` and fill secrets.
2. Install deps: `npm install` (root) then `cd apps/api && npm install`.
3. Run dev server: `npm run dev`.

### Environment variables (what they are)
| Key | Description | Example |
| --- | --- | --- |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/coffeehubnepal` or Atlas SRV |
| `JWT_SECRET` | Secret for signing auth tokens | `super-secret-string` |
| `PORT` | API port | `4000` |
| `CLIENT_ORIGIN` | Allowed CORS origin for the web app | `http://localhost:5173` |
| `RATE_LIMIT_PER_MINUTE` | Requests per IP per minute | `60` |
| `LOCKOUT_THRESHOLD` | Failed login attempts before lockout | `5` |
| `LOCKOUT_WINDOW_MINUTES` | Lock duration in minutes | `15` |
| `CAPTCHA_SECRET` | Set to enable CAPTCHA check (empty disables) | `your-turnstile-secret` |
| `SMTP_HOST` | SMTP server for password reset emails | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (usually 587) | `587` |
| `SMTP_USER` | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/API key | `your-password` |
| `SMTP_FROM` | Sender email address | `noreply@coffeehubnepal.com` |
| `RESET_TOKEN_EXPIRY_HOURS` | Password reset token expiry (hours) | `1` |

### How to obtain values (Azure Cosmos DB for Mongo)

**Step 1: Create Database**
1. In Azure Portal, open your Cosmos DB account
2. Click **"Create a database"** (or go to Data Explorer → New Database)
3. Database ID: `coffeehubnepal`
4. Throughput: Choose **Serverless** (if selected during account creation) or **Autoscale** with max 1000 RU/s
5. Click **Create**

**Step 2: Get Connection String**
1. Click **"Connect to your database"** (or go to Settings → Connection String)
2. Switch to **"Connection string"** tab (not "Keys")
3. Copy the `mongodb+srv://...` connection string
4. It will look like: `mongodb+srv://<account>:<password>@<account>.mongo.cosmos.azure.com:10255/<dbname>?ssl=true&replicaSet=globaldb`

**Step 3: Create MongoDB User**
1. In the same "Connect" section, go to **"Keys"** tab
2. Scroll to **"MongoDB Users"** section
3. Click **"Add MongoDB User"**
4. Create username and password (save these!)
5. Replace `<account>` and `<password>` in your connection string with these credentials

**Step 4: Configure Networking**
1. Go to your Cosmos DB account → **"Networking"**
2. For development: Add your current public IP to firewall rules (or temporarily allow all IPs)
3. For production: Use **Private Endpoint** with VNet integration
4. Save changes

**Step 5: Update .env File**
1. Copy `env.example` to `.env`: `cp env.example .env`
2. Replace `MONGO_URI` with your Azure connection string (from Step 2, with user credentials from Step 3)
3. Replace `<dbname>` in the URI with `coffeehubnepal`
4. Set `JWT_SECRET` to a long random string: `openssl rand -hex 32` (or use an online generator)
5. Set `CLIENT_ORIGIN` to your web app URL (e.g., `http://localhost:5173`)

**Example .env:**
```
MONGO_URI=mongodb+srv://myuser:mypassword@coffeehub-mongo-dev.mongo.cosmos.azure.com:10255/coffeehubnepal?ssl=true&replicaSet=globaldb
JWT_SECRET=your-generated-secret-here
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

## Endpoints
- `POST /auth/signup`  
  - Body: `{ email, password }`  
  - Errors: `EMAIL_IN_USE`, `WEAK_PASSWORD`, `VALIDATION_ERROR`, `CAPTCHA_REQUIRED`.
- `POST /auth/login`  
  - Body: `{ email, password }`  
  - Errors: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`, `VALIDATION_ERROR`, `CAPTCHA_REQUIRED`.
- `POST /auth/forgot-password`  
  - Body: `{ email }`  
  - Always returns success (security: doesn't reveal if email exists).
- `POST /auth/reset-password`  
  - Body: `{ token, password }`  
  - Errors: `TOKEN_EXPIRED`, `INVALID_TOKEN`, `WEAK_PASSWORD`.

Responses on success: `{ token, user: { id, email } }` (for signup/login).

## Security
- Email format check; password must include upper, lower, number, min 8 chars.
- Rate limit per IP and per account; lockout after configured failed attempts.
- CAPTCHA hook via `x-captcha-token` header when `CAPTCHA_SECRET` is set.

## Testing
- `npm test` (uses mongodb-memory-server + supertest + vitest).

## Important: Create Collections Manually

**Azure Cosmos DB requires collections to be created manually** to avoid throughput limit errors.

After setting up your database, you must create collections in Azure Portal:

1. Go to **Data Explorer** in your Cosmos DB account
2. Select database `coffeehubnepal`
3. Create these collections:
   - `users` - 400 RU/s (for authentication)
   - `blogposts` - 400 RU/s (for blog feature)

**Total throughput must not exceed 1000 RU/s** (your account limit).

See `AZURE_COLLECTION_SETUP.md` for detailed instructions.

## Password Reset Email Setup

To enable password reset emails, you need to configure SMTP settings. See **[PASSWORD_RESET_SETUP.md](./PASSWORD_RESET_SETUP.md)** for a complete guide on:
- Setting up Gmail, SendGrid, AWS SES, or custom SMTP
- Getting SMTP credentials
- Testing the email configuration
- Troubleshooting common issues

**Quick Start:** Add these to your `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@coffeehubnepal.com
RESET_TOKEN_EXPIRY_HOURS=1
```

**Note:** If SMTP is not configured, reset links will be logged to the console in development mode.

