import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

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

