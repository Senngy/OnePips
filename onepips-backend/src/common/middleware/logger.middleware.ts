import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - startTime;
      const requestId = (request as any).requestId ?? 'req_unknown';
      const logData = {
        message: "HTTP request completed",
        requestId: requestId,
        method: method,
        path: originalUrl,
        statusCode: statusCode,
        durationMs: duration,
      }

      if (statusCode >= 500) {
        this.logger.error(logData);
      } else if (statusCode >= 400) {
        this.logger.warn(logData);
      } else {
        this.logger.log(logData);
      }
    });

    next();
  }
}
