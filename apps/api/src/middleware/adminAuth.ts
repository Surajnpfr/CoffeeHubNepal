import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      error: 'FORBIDDEN', 
      message: 'Admin access required' 
    });
  }
  next();
};

export const requireAdminOrModerator = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin' && req.userRole !== 'moderator') {
    return res.status(403).json({ 
      error: 'FORBIDDEN', 
      message: 'Admin or moderator access required' 
    });
  }
  next();
};

