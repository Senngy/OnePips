"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      if (user) {
        router.replace("/admin/dashboard");
      }
      return;
    }

    if (!user) {
      router.replace("/admin/login");
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-on-surface">
        <p className="text-sm text-outline">Vérification de la session en cours...</p>
      </div>
    );
  }

  if (!user && !PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return null;
  }

  if (user && PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
