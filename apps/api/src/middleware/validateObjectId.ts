import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from '../utils/sanitize.js';

/**
 * Middleware to validate that route parameters are valid MongoDB ObjectIds
 * @param paramNames - Array of parameter names to validate (default: ['id'])
 */
export const validateObjectId = (paramNames: string[] = ['id']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const param of paramNames) {
      const value = req.params[param];
      if (value && !isValidObjectId(value)) {
        return res.status(400).json({
          error: 'INVALID_ID',
          message: `Invalid ${param} format. Expected a valid ObjectId.`
        });
      }
    }
    next();
  };
};

