"use client";

import { useRef, useEffect, useCallback } from "react";

interface TurnstileProps {
  onToken: (token: string) => void;
  options?: Record<string, string>;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export default function Turnstile({ onToken, options = {} }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>();

  const init = useCallback(() => {
    if (typeof window === "undefined") return;
    const tw = (window as any).turnstile;
    if (!tw || !containerRef.current) return;

    if (widgetId.current) {
      tw.remove(widgetId.current);
    }

    widgetId.current = tw.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: onToken,
      ...options,
    });
  }, [onToken, options]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).turnstile) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.head.appendChild(script);

    return () => {
      if (widgetId.current && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetId.current);
      }
    };
  }, [init]);

  return <div ref={containerRef} />;
}
