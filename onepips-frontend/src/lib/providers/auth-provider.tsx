"use client";

import {
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";

import { AuthContext, type AuthUser } from "@/lib/contexts/auth.context";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    console.log("[AuthProvider] refreshSession START");
    try {
      setLoading(true);
      console.log("[AuthProvider] loading -> true");

      const session = await authClient.getSession();
      console.log("[AuthProvider] session (JSON):", JSON.stringify(session, null, 2));
      console.log("[AuthProvider] session.data (JSON):", JSON.stringify(session?.data, null, 2));
      console.log("[AuthProvider] session.data.user (JSON):", JSON.stringify(session?.data?.user, null, 2));
      console.log("[AuthProvider] session.data.user?.role:", session?.data?.user?.role);
      console.log("[AuthProvider] Object.keys(session.data?.user):", Object.keys(session?.data?.user || {}));

      const userFromSession = session?.data?.user ?? null;
      console.log("[AuthProvider] userFromSession (JSON):", JSON.stringify(userFromSession, null, 2));
      console.log("[AuthProvider] userFromSession.role:", userFromSession?.role);
      console.log("[AuthProvider] BEFORE setUser — userFromSession keys:", Object.keys(userFromSession || {}));

      setUser(userFromSession);
    } catch (error) {
      console.error("[AuthProvider] refreshSession ERROR:", error);
      setUser(null);
    } finally {
      console.log("[AuthProvider] loading -> false");
      console.log("[AuthProvider] refreshSession END");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("[AuthProvider] user state changed (JSON):", JSON.stringify(user, null, 2));
    console.log("[AuthProvider] user.role from state:", user?.role);
  }, [user]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}