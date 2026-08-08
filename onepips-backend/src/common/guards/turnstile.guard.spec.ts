import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('TurnstileGuard', () => {
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;
  const originalBypassToken = process.env.TURNSTILE_BYPASS_TOKEN;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = originalSecret;
    }

    if (originalBypassToken === undefined) {
      delete process.env.TURNSTILE_BYPASS_TOKEN;
    } else {
      process.env.TURNSTILE_BYPASS_TOKEN = originalBypassToken;
    }

    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('uses the runtime turnstile secret when the env var is set later', async () => {
    const fetchSpy = jest.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });

    global.fetch = fetchSpy;

    const { TurnstileGuard } = await import('./turnstile.guard');
    const guard = new TurnstileGuard(new Reflector());

    process.env.TURNSTILE_SECRET_KEY = 'runtime-secret';

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ body: { cfTurnstileToken: 'token' } }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(fetchSpy).toHaveBeenCalled();
    const [, options] = fetchSpy.mock.calls[0];
    const body = options?.body as URLSearchParams;
    expect(body.get('secret')).toBe('runtime-secret');
  });
});
