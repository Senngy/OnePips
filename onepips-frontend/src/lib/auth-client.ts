
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
});