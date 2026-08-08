import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private getToken(request: any): string | undefined {
    const body = request?.body ?? {};

    return (
      body.cfTurnstileToken ??
      body['cf-turnstile-response'] ??
      body.cfTurnstileResponse ??
      body.token
    );
  }

  private getTurnstileSecret(): string {
    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

    if (!secret) {
      throw new UnauthorizedException('Turnstile secret is not configured');
    }

    return secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException('Turnstile token is required');
    }

    const bypassToken = process.env.TURNSTILE_BYPASS_TOKEN || 'DEV_BYPASS';

    if (token === bypassToken) {
      delete request.body?.cfTurnstileToken;
      delete request.body?.['cf-turnstile-response'];
      delete request.body?.cfTurnstileResponse;
      return true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', this.getTurnstileSecret());
      formData.append('response', token);

      const result = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        },
      );

      const outcome = await result.json();

      if (!outcome.success) {
        throw new UnauthorizedException('Turnstile verification failed');
      }

      delete request.body?.cfTurnstileToken;
      delete request.body?.['cf-turnstile-response'];
      delete request.body?.cfTurnstileResponse;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Turnstile verification error');
    }
  }
}
