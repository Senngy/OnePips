import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

type Entry = { count: number; expires: number };

const store = new Map<string, Entry>();

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const path = req.originalUrl || req.url || '';
      // Only apply to auth routes (API prefix included)
      if (!path.startsWith('/api/auth')) return next();

      const ip = (req.ip ||
        req.headers['x-forwarded-for'] ||
        (req.connection && (req.connection as any).remoteAddress) ||
        '') as string;
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute

      // Stricter limits for sign-in / sign-up / forgot-password
      const isSensitive =
        /sign-in|sign-up|forgot-password|sign-in\/email|sign-up\/email/.test(
          path,
        );
      const limit = isSensitive ? 5 : 100; // 5/min for auth sensitive endpoints

      const key = `${ip}:${path}`;
      let entry = store.get(key);
      if (!entry || entry.expires < now) {
        entry = { count: 0, expires: now + windowMs };
      }

      entry.count += 1;
      store.set(key, entry);

      if (entry.count > limit) {
        res.status(429).json({ message: 'Too many requests' });
        return;
      }

      // basic cleanup occasionally
      if (store.size > 10000) {
        const cutoff = now - windowMs * 2;
        for (const [k, v] of store) if (v.expires < cutoff) store.delete(k);
      }

      next();
    } catch (e) {
      next();
    }
  }
}
