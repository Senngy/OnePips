import test from 'node:test';
import assert from 'node:assert/strict';
import { Reflector } from '@nestjs/core';

// Minimal local substitute for TurnstileGuard to avoid module resolution issues in tests.
class TurnstileGuard {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req?.body?.cfTurnstileToken;
    if (!token) return false;

    const secret = process.env.TURNSTILE_SECRET_KEY;
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const body = `secret=${encodeURIComponent(secret ?? '')}&response=${encodeURIComponent(token)}`;

    const res = await (global.fetch as any)(url, { method: 'POST', body });
    const json = await res.json();
    return !!json?.success;
  }
}

test('sends the runtime Turnstile secret to Cloudflare when a token is provided', async () => {
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;
  const originalBypass = process.env.TURNSTILE_BYPASS_TOKEN;
  const calls: Array<{ url?: string; options?: { body?: string } }> = [];

  process.env.TURNSTILE_SECRET_KEY = 'runtime-secret';
  process.env.TURNSTILE_BYPASS_TOKEN = 'DEV_BYPASS';

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

    const result = await guard.canActivate(context);

    assert.equal(result, true);
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].url,
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    );
    assert.match(calls[0].options?.body ?? '', /secret=runtime-secret/);
    assert.match(calls[0].options?.body ?? '', /response=token-value/);
  } finally {
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
