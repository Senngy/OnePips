import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { RedisService } from '../redis/redis.service.js';

type Entry = { count: number; expires: number };

const store = new Map<string, Entry>();

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthRateLimitMiddleware.name);

  constructor(
    private readonly redis: RedisService,
  ) { }
  async use(req: Request, res: Response, next: NextFunction) {

    try {
      const path = req.originalUrl || req.url || '';
      // Only apply to auth routes (API prefix included)
      if (!path.startsWith('/api/auth')) return next();

      const pathname = path.split('?')[0];

      const rawIp =
        req.ip ||
        req.socket.remoteAddress ||
        'unknown';
      const ip = rawIp.startsWith('::ffff:')
        ? rawIp.substring(7)
        : rawIp;

      const isSensitive =
        /\/sign-in(?:\/email)?$|\/sign-up(?:\/email)?$|\/forgot-password/.test(
          pathname,
        );

      const limit = isSensitive ? 5 : 100;
      const windowSeconds = 60; // Redis key lifetime

      const key = `rate-limit:auth:${ip}:${pathname}`;

      const count = await this.redis.increment(
        key,
        windowSeconds,
      );

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader(
        'X-RateLimit-Remaining',
        Math.max(limit - count, 0),
      );

      if (count > limit) {
        res.status(429).json({
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
        });
        return;
      }

      next();
    } catch (error) {
      this.logger.error(
        'Redis rate limit failed',
        error instanceof Error ? error.message : String(error),
      );

      // Fail-open :
      // si Redis est indisponible, ne pas bloquer toute l'auth.
      next();
    }
  }
}
