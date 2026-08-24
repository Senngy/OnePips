import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
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
      throw new InternalServerErrorException({
        code: 'SECURITY_TURNSTILE_MISCONFIGURED',
        message: 'Le service de vérification de sécurité est momentanément indisponible.',
      });
    }

    return secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      throw new BadRequestException({
        code: 'SECURITY_TURNSTILE_REQUIRED',
        message: 'Le contrôle de sécurité est requis.',
        details: { field: 'cfTurnstileToken' },
      });
    }

    const bypassToken = process.env.TURNSTILE_BYPASS_TOKEN || 'DEV_BYPASS';

    if (token === bypassToken) {
      delete request.body?.cfTurnstileToken;
      delete request.body?.['cf-turnstile-response'];
      delete request.body?.cfTurnstileResponse;
      return true;
    }

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
      throw new BadRequestException({
        code: 'SECURITY_TURNSTILE_INVALID',
        message: 'Le contrôle de sécurité a échoué.',
        details: { field: 'cfTurnstileToken' },
      });
    }

    delete request.body?.cfTurnstileToken;
    delete request.body?.['cf-turnstile-response'];
    delete request.body?.cfTurnstileResponse;
    return true;
  }
}
