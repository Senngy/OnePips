import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const id = `req_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
    (req as any).requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}
