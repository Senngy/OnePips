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
  console.log("[API Client] Request sent:", `${API_URL}${endpoint}`, options);
  const { auth = false, ...rest } = options;
  console.log("[API Client] Request sent auth and rest:", auth, rest);

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
  console.log("[API Client] Request sent:", `${API_URL}${endpoint}`, rest);
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });
  console.log("[API Client] Request res:", `${API_URL}${endpoint}`, res);
  let data;
  try {
    data = await res.json();
    console.log("[API Client] Request data:", data);
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


