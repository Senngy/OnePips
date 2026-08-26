"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import { AuthContext, type AuthUser } from "@/lib/contexts/auth.context";
import { authClient } from "@/lib/auth-client";
import { onUnauthorized } from "@/lib/auth-events";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const sessionExpiredRef = useRef(false);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);

      const session = await authClient.getSession();

      const userFromSession = session?.data?.user ?? null;

      setUser(userFromSession);
      if (userFromSession) {
        sessionExpiredRef.current = false;
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // 401 détecté par api-client → invalidation idempotente de la session.
  // Le flag évite les événements/redirections multiples lors de 401 simultanés,
  // et se réinitialise à la prochaine session valide (reconnexion).
  useEffect(() => {
    return onUnauthorized(() => {
      if (sessionExpiredRef.current) {
        return;
      }
      sessionExpiredRef.current = true;
      setUser(null);
      queryClient.clear();
    });
  }, [queryClient]);

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