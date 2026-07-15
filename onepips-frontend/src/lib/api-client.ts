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

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // important
  });

  let data = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new ApiError(
      (data as any)?.message ?? "Une erreur est survenue",
      res.status,
      data,
    );
  }

  return data;
}

