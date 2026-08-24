const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api(
  endpoint: string,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${API_URL}${endpoint}`;
  console.log("[API] REQUEST:", options.method || "GET", url);
  console.log("[API] REQUEST HEADERS:", Object.fromEntries(headers.entries()));
  console.log(
  "[API] REQUEST BODY:",
  options.body instanceof FormData
    ? Object.fromEntries(options.body.entries())
    : options.body,
);

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // important
  });

  console.log("[API] STATUS:", res.status, url);

  if (res.status === 304) {
    console.log("[API] 304 NOT MODIFIED — no body expected");
  }

  let data = null;

  try {
    data = await res.json();
    if (res.status === 304) {
      console.log("[API] 304 parsed body:", data);
    }
  } catch {
    throw new ApiError("Invalid JSON response", res.status);
  }

  console.log("[API] OK:", res.ok, "| url:", url);

  if (!res.ok) {
    throw new ApiError(
      (data as any)?.message ?? "Une erreur est survenue",
      res.status,
      data,
    );
  }

  console.log("[API] RESPONSE:", data);
  return data;
}

