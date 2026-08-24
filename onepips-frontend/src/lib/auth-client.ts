
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugin: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    })
  ],
  fetchOptions: {
    onResponse(context) {
      if (context.response?.url?.includes("get-session")) {
        context.response
          .clone()
          .json()
          .then((raw) => {
            console.log("[AuthClient] RAW get-session response (JSON):", JSON.stringify(raw, null, 2));
            console.log("[AuthClient] raw.user:", raw?.user);
            console.log("[AuthClient] raw.user.role:", raw?.user?.role);
            console.log("[AuthClient] raw.user keys:", Object.keys(raw?.user || {}));
          })
          .catch(() => {
            console.log("[AuthClient] RAW get-session — could not parse body");
          });
      }
    },
  },
});