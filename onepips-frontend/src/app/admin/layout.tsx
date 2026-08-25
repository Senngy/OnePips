"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const PUBLIC_ADMIN_ROUTES = ["/admin/login", "/admin/invitation"];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AdminLayout] useEffect");
    console.log("[AdminLayout] loading:", loading);
    console.log("[AdminLayout] user:", user);
    console.log("[AdminLayout] user role:", user?.role);
    console.log("[AdminLayout] pathname:", pathname);

    if (loading) {
      console.log("[AdminLayout] loading=true — skip checks");
      return;
    }

    if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      if (user) {
        console.log("[AdminLayout] REDIRECT public+auth -> /admin/dashboard");
        router.replace("/admin/dashboard");
      }
      return;
    }

    if (!user) {
      console.log("[AdminLayout] REDIRECT no-user -> /admin/login");
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
