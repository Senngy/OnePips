const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api(endpoint: string, options: FetchOptions = {}) {
  console.log("api endpoint called", endpoint);
  const { auth = false, ...rest } = options;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Plus tard : gestion du token JWT
  if (auth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });
  let data;
  try {
    data = await res.json();
  } catch (error) {
    data = null;
    console.error("error", error);
  }
  if (!res.ok) {
    throw new ApiError(
      data?.message || "Une erreur est survenue",
      res.status,
      data
    );
  }
  return data;
}


