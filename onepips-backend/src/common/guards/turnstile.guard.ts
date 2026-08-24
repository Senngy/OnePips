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
    console.log(
      '[API] turnstile.guard.ts - lecture du token dans la requête, retourne le corps de la requête:',
      body,
    );
    console.log('[API] Turnstile - BODY KEYS:', Object.keys(body));
    const token =
      body.cfTurnstileToken ??
      body['cf-turnstile-response'] ??
      body.cfTurnstileResponse ??
      body.token;

    console.log(
      '[API] turnstile.guard.ts - token lu, retourne un token présent:',
      Boolean(token),
    );

    return token;
  }

  private getTurnstileSecret(): string {
    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

    if (!secret) {
      console.log(
        '[API] turnstile.guard.ts - secret Turnstile absent, retourne une erreur de configuration',
      );
      throw new UnauthorizedException('Turnstile secret is not configured');
    }

    console.log(
      '[API] turnstile.guard.ts - secret Turnstile chargé, retourne un secret valide',
    );
    return secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      console.log(
        '[API] turnstile.guard.ts - token absent, retourne une erreur 401',
      );
      throw new UnauthorizedException('Turnstile token is required');
    }

    const bypassToken = process.env.TURNSTILE_BYPASS_TOKEN || 'DEV_BYPASS';

    if (token === bypassToken) {
      console.log(
        '[API] turnstile.guard.ts - token bypass reconnu, retourne true',
      );
      delete request.body?.cfTurnstileToken;
      delete request.body?.['cf-turnstile-response'];
      delete request.body?.cfTurnstileResponse;
      return true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', this.getTurnstileSecret());
      formData.append('response', token);
      console.log(
        '[API] turnstile.guard.ts - requête Cloudflare envoyée, retourne une réponse de vérification',
      );

      const result = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        },
      );

      const outcome = await result.json();
      console.log(
        '[API] turnstile.guard.ts - réponse Cloudflare reçue, retourne success:',
        Boolean(outcome?.success),
      );

      if (!outcome.success) {
        console.log(
          '[API] turnstile.guard.ts - vérification Cloudflare refusée, retourne une erreur 401',
        );
        throw new UnauthorizedException('Turnstile verification failed');
      }

      delete request.body?.cfTurnstileToken;
      delete request.body?.['cf-turnstile-response'];
      delete request.body?.cfTurnstileResponse;
      console.log(
        '[API] turnstile.guard.ts - token nettoyé, retourne true',
      );
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        console.log(
          '[API] turnstile.guard.ts - erreur d autorisation détectée, retourne une erreur 401',
        );
        throw error;
      }
      console.log(
        '[API] turnstile.guard.ts - erreur technique de vérification, retourne une erreur 401',
      );
      throw new UnauthorizedException('Turnstile verification error');
    }
  }
}
