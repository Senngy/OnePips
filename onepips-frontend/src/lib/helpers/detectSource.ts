const STORAGE_KEY = "onepips_source";

export type Source = 
  | "direct"
  | "funnel_multistep"
  | "live_form"
  | "quick_apply"
  | "landing_candidater"
  | `utm_${string}`;

export function detectSource(): Source {
  if (typeof window === "undefined") return "direct";

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  if (utmSource) {
    const source: Source = `utm_${utmSource}`;
    sessionStorage.setItem(STORAGE_KEY, source);
    return source;
  }

  const referrer = document.referrer;
  if (referrer.includes("facebook")) {
    sessionStorage.setItem(STORAGE_KEY, "utm_facebook");
    return "utm_facebook";
  }
  if (referrer.includes("google")) {
    sessionStorage.setItem(STORAGE_KEY, "utm_google");
    return "utm_google";
  }
  if (referrer.includes("instagram")) {
    sessionStorage.setItem(STORAGE_KEY, "utm_instagram");
    return "utm_instagram";
  }

  if (window.location.pathname.includes("landing/candidater")) {
    sessionStorage.setItem(STORAGE_KEY, "landing_candidater");
    return "landing_candidater";
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) return stored as Source;

  return "direct";
}
