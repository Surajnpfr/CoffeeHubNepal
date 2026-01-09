import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.rateLimitPerMinute,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED' }
});

export const accountRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Math.max(5, Math.floor(env.rateLimitPerMinute / 2)),
  keyGenerator: (req) => (typeof req.body?.email === 'string' ? req.body.email : 'anonymous'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'ACCOUNT_RATE_LIMITED' }
});

// Rate limiter for password reset requests (3 requests per hour per IP)
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'PASSWORD_RESET_RATE_LIMITED', message: 'Too many password reset requests. Please try again later.' }
});
