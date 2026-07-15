"use client";

import { createContext } from "react";

export type AuthUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  [key: string]: unknown;
} | null;

export type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);