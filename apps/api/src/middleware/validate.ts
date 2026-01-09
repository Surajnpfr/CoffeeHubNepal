import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({ error: 'VALIDATION_ERROR', details: errors });
    }
    req.body = result.data;
    next();
  };

