import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import type { Request, Response } from 'express';

interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId: string;
}

const GENERIC_CODE_BY_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMIT_EXCEEDED',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
};

const INTERNAL_ERROR_MESSAGE = 'Une erreur interne est survenue.';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // Better Auth : ne jamais reformater une réponse déjà envoyée.
    if (res.headersSent) {
      return;
    }

    const requestId = (req as any).requestId ?? 'req_unknown';

    if (exception instanceof ThrottlerException) {
      this.respond(
        res,
        requestId,
        HttpStatus.TOO_MANY_REQUESTS,
        'RATE_LIMIT_EXCEEDED',
        'Trop de requêtes. Veuillez réessayer plus tard.',
      );
      return;
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      this.handlePrisma(res, requestId, exception);
      return;
    }

    if (exception instanceof HttpException) {
      this.handleHttpException(res, requestId, exception);
      return;
    }

    if (exception instanceof Error) {
      this.logger.error(`[${requestId}] ${exception.stack ?? exception.message}`);
      this.respond(
        res,
        requestId,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_ERROR',
        INTERNAL_ERROR_MESSAGE,
      );
      return;
    }

    this.logger.error(`[${requestId}] Unknown exception: ${String(exception)}`);
    this.respond(
      res,
      requestId,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      INTERNAL_ERROR_MESSAGE,
    );
  }

  private handleHttpException(
    res: Response,
    requestId: string,
    exception: HttpException,
  ): void {
    const statusCode = exception.getStatus();
    const body = exception.getResponse();

    const structured = this.extractStructuredBody(body);
    if (structured) {
      this.respond(
        res,
        requestId,
        statusCode,
        structured.code,
        structured.message,
        structured.details,
      );
      return;
    }

    const code = GENERIC_CODE_BY_STATUS[statusCode] ?? 'INTERNAL_ERROR';
    const message =
      statusCode >= 500
        ? INTERNAL_ERROR_MESSAGE
        : this.extractMessage(body, 'Une erreur est survenue.');
    this.respond(res, requestId, statusCode, code, message);
  }

  private handlePrisma(
    res: Response,
    requestId: string,
    exception: PrismaClientKnownRequestError,
  ): void {
    if (exception.code === 'P2002') {
      this.logger.warn(`[${requestId}] P2002 ${exception.message}`);
      this.respond(
        res,
        requestId,
        HttpStatus.CONFLICT,
        'CONFLICT',
        'Cette ressource existe déjà.',
      );
      return;
    }

    if (exception.code === 'P2025') {
      this.logger.warn(`[${requestId}] P2025 ${exception.message}`);
      this.respond(
        res,
        requestId,
        HttpStatus.NOT_FOUND,
        'NOT_FOUND',
        'Ressource introuvable.',
      );
      return;
    }

    this.logger.error(
      `[${requestId}] ${exception.code} ${exception.stack ?? exception.message}`,
    );
    this.respond(
      res,
      requestId,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      INTERNAL_ERROR_MESSAGE,
    );
  }

  private extractStructuredBody(body: unknown): {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null {
    if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      if (typeof obj.code === 'string' && typeof obj.message === 'string') {
        const details =
          obj.details && typeof obj.details === 'object'
            ? (obj.details as Record<string, unknown>)
            : undefined;
        return { code: obj.code, message: obj.message, details };
      }
    }
    return null;
  }

  private extractMessage(body: unknown, fallback: string): string {
    if (typeof body === 'string') {
      return body;
    }
    if (body && typeof body === 'object') {
      const message = (body as Record<string, unknown>).message;
      if (typeof message === 'string') {
        return message;
      }
    }
    return fallback;
  }

  private respond(
    res: Response,
    requestId: string,
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ): void {
    const payload: ApiErrorResponse = { statusCode, code, message, requestId };
    if (details) {
      payload.details = details;
    }

    if (statusCode >= 500) {
      this.logger.error(`[${requestId}] ${code} — ${message}`);
    } else {
      this.logger.warn(`[${requestId}] ${code} — ${message}`);
    }

    res.status(statusCode).json(payload);
  }
}
