const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId: string;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly requestId: string;

  constructor(data: ApiErrorResponse) {
    super(data.message);
    this.name = "ApiError";
    this.statusCode = data.statusCode;
    this.code = data.code;
    this.details = data.details;
    this.requestId = data.requestId;
  }
}

function isApiErrorResponse(
  value: unknown,
): value is ApiErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.statusCode === "number" &&
    typeof body.code === "string" &&
    typeof body.message === "string"
  );
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = isApiErrorResponse(data)
      ? data
      : {
        statusCode: res.status,
        code: "UNKNOWN_ERROR",
        message: "Une erreur est survenue.",
        requestId:
          res.headers.get("X-Request-Id") ?? "req_unknown",
      };

    throw new ApiError(errorData);
  }

  return data as T;
}
