import type { HelmetOptions } from 'helmet';

export function helmetOptions(env: string): HelmetOptions {
  const isProd = env === 'production';

  return {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    xDnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: isProd
      ? { maxAge: 86400, includeSubDomains: true, preload: false }
      : false,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'no-referrer' },
  };
}
