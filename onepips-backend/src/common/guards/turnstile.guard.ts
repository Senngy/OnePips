import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '0x000000000000000000000000000000000000000';
const BYPASS_TOKEN = process.env.TURNSTILE_BYPASS_TOKEN || 'DEV_BYPASS';

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.body?.cfTurnstileToken;

    if (!token) {
      throw new UnauthorizedException('Turnstile token is required');
    }

    // Allow bypass in development
    if (token === BYPASS_TOKEN) {
      delete request.body.cfTurnstileToken;
      return true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', TURNSTILE_SECRET);
      formData.append('response', token);

      const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });

      const outcome = await result.json();

      if (!outcome.success) {
        throw new UnauthorizedException('Turnstile verification failed');
      }

      delete request.body.cfTurnstileToken;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Turnstile verification error');
    }
  }
}
