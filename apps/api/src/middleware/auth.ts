import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string; email: string; role?: string };
    
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to require verified user account
 * Admin and moderator users are automatically considered verified
 */
export const requireVerified = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        error: 'UNAUTHORIZED', 
        message: 'Authentication required' 
      });
    }

    const user = await User.findById(req.userId).select('verified role').lean();
    
    if (!user) {
      return res.status(401).json({ 
        error: 'USER_NOT_FOUND', 
        message: 'User not found' 
      });
    }

    // Admin and moderator are automatically verified
    if (user.role === 'admin' || user.role === 'moderator') {
      return next();
    }

    if (!user.verified) {
      return res.status(403).json({ 
        error: 'VERIFICATION_REQUIRED', 
        message: 'Account verification required. Please wait for admin approval.' 
      });
    }

    next();
  } catch (error) {
    console.error('Require verified error:', error);
    return res.status(500).json({ 
      error: 'VERIFICATION_CHECK_FAILED', 
      message: 'Failed to verify account status' 
    });
  }
};

