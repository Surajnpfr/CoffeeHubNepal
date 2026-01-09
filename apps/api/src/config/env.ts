import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: toNumber(process.env.PORT, 4000),
  mongoUri: process.env.MONGO_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  rateLimitPerMinute: toNumber(process.env.RATE_LIMIT_PER_MINUTE, 60),
  lockoutThreshold: toNumber(process.env.LOCKOUT_THRESHOLD, 5),
  lockoutWindowMinutes: toNumber(process.env.LOCKOUT_WINDOW_MINUTES, 15),
  captchaSecret: process.env.CAPTCHA_SECRET,
  // Email configuration
  smtpHost: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  smtpPort: toNumber(process.env.SMTP_PORT, 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  smtpFrom: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'noreply@example.com',
  resetTokenExpiryHours: toNumber(process.env.RESET_TOKEN_EXPIRY_HOURS, 1)
};

