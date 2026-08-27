import type { NextConfig } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const API_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
).origin;

const publicCsp = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",

  `img-src 'self' data: blob: ${API_ORIGIN} https://lh3.googleusercontent.com`,

  "font-src 'self' https://fonts.gstatic.com",

  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",

  `connect-src 'self' ${API_ORIGIN} https://challenges.cloudflare.com`,

  "frame-src 'self' https://www.youtube.com https://challenges.cloudflare.com",
].join("; ");

const adminCsp = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",

  `img-src 'self' data: blob: ${API_ORIGIN} https://lh3.googleusercontent.com`, ,

  "font-src 'self' https://fonts.gstatic.com",

  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",

  `connect-src 'self' ${API_ORIGIN} https://challenges.cloudflare.com`,

  "frame-src 'self' https://www.youtube.com https://challenges.cloudflare.com",
].join("; ");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // ---------------------------------
      // C6 — CSP Report-Only public
      // ---------------------------------
      {
        source: "/((?!admin(?:/|$)).*)",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: publicCsp,
          },
        ],
      },

      // ---------------------------------
      // C7 — CSP Report-Only admin
      // ---------------------------------
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: adminCsp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
