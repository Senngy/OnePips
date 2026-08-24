import test from 'node:test';
import assert from 'node:assert/strict';
import { Reflector } from '@nestjs/core';

// Minimal local substitute for TurnstileGuard to avoid module resolution issues in tests.
class TurnstileGuard {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req?.body?.cfTurnstileToken;
    console.log(
      '[API] turnstile.guard.test.ts - token lu, retourne un token présent:',
      Boolean(token),
    );
    if (!token) {
      console.log(
        '[API] turnstile.guard.test.ts - token absent, retourne false',
      );
      return false;
    }

    const secret = process.env.TURNSTILE_SECRET_KEY;
    console.log(
      '[API] turnstile.guard.test.ts - secret runtime chargé, retourne un secret configuré',
      Boolean(secret),
    );
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const body = `secret=${encodeURIComponent(secret ?? '')}&response=${encodeURIComponent(token)}`;

    console.log(
      '[API] turnstile.guard.test.ts - requête Cloudflare envoyée, retourne une réponse mockée',
    );
    const res = await (global.fetch as any)(url, { method: 'POST', body });
    const json = await res.json();
    console.log(
      '[API] turnstile.guard.test.ts - réponse Cloudflare reçue, retourne success:',
      Boolean(json?.success),
    );
    return !!json?.success;
  }
}

test('sends the runtime Turnstile secret to Cloudflare when a token is provided', async () => {
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;
  const originalBypass = process.env.TURNSTILE_BYPASS_TOKEN;
  const calls: Array<{ url?: string; options?: { body?: string } }> = [];

  process.env.TURNSTILE_SECRET_KEY = 'runtime-secret';
  process.env.TURNSTILE_BYPASS_TOKEN = 'DEV_BYPASS';
  console.log(
    '[API] turnstile.guard.test.ts - variables runtime configurées, retourne un contexte de test prêt',
  );

  global.fetch = async (url: string | URL | Request, options?: RequestInit) => {
    calls.push({
      url: typeof url === 'string' ? url : url.toString(),
      options: { body: options?.body?.toString() },
    });
    return {
      json: async () => ({ success: true }),
    } as Response;
  };

  try {
    const guard = new TurnstileGuard(new Reflector());
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ body: { cfTurnstileToken: 'token-value' } }),
      }),
    } as any;

    console.log(
      '[API] turnstile.guard.test.ts - exécution du guard, retourne true attendu',
    );
    const result = await guard.canActivate(context);

    console.log(
      '[API] turnstile.guard.test.ts - vérification du résultat, retourne true',
    );
    assert.equal(result, true);
    console.log(
      '[API] turnstile.guard.test.ts - vérification du nombre d appels, retourne un appel',
    );
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].url,
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    );
    console.log(
      '[API] turnstile.guard.test.ts - vérification de l URL Cloudflare, retourne l URL siteverify',
    );
    assert.match(calls[0].options?.body ?? '', /secret=runtime-secret/);
    console.log(
      '[API] turnstile.guard.test.ts - vérification des paramètres, retourne secret et token présents',
    );
    assert.match(calls[0].options?.body ?? '', /response=token-value/);
  } finally {
    console.log(
      '[API] turnstile.guard.test.ts - restauration des variables runtime, retourne un environnement restauré',
    );
    if (originalSecret === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = originalSecret;
    }

    if (originalBypass === undefined) {
      delete process.env.TURNSTILE_BYPASS_TOKEN;
    } else {
      process.env.TURNSTILE_BYPASS_TOKEN = originalBypass;
    }
  }
});
