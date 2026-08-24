import type { Request, Response, NextFunction } from 'express';
import express from 'express';

const jsonParser = express.json();

export function jsonBodyParserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  return jsonParser(req, res, next);
}