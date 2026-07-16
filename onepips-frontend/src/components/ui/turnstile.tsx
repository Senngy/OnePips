"use client";

import { useRef, useEffect, useCallback } from "react";

interface TurnstileProps {
  onToken: (token: string) => void;
  options?: Record<string, string>;
}

interface TurnstileWidget {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
}

interface TurnstileWindow extends Window {
  turnstile?: TurnstileWidget;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

export default function Turnstile({ onToken, options = {} }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>();

  const clearToken = useCallback(() => {
    onToken("");
  }, [onToken]);

  const init = useCallback(() => {
    if (typeof window === "undefined") return;
    const tw = (window as TurnstileWindow).turnstile;
    if (!tw || !containerRef.current) return;

    if (!SITE_KEY) {
      clearToken();
      return;
    }

    if (widgetId.current) {
      tw.remove(widgetId.current);
    }

    widgetId.current = tw.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: onToken,
      "expired-callback": clearToken,
      "error-callback": clearToken,
      ...options,
    });
  }, [clearToken, onToken, options]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as TurnstileWindow).turnstile) {
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
      if (widgetId.current && (window as TurnstileWindow).turnstile) {
        (window as TurnstileWindow).turnstile?.remove(widgetId.current);
      }
    };
  }, [init]);

  return (
    <div className="flex flex-col items-center gap-2">
      {!SITE_KEY && (
        <p className="text-xs text-amber-600 text-center">
          La vérification Turnstile n’est pas configurée. Ajoutez NEXT_PUBLIC_TURNSTILE_SITE_KEY pour activer le formulaire.
        </p>
      )}
      <div ref={containerRef} />
    </div>
  );
}
