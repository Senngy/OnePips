"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

const PUBLIC_ADMIN_ROUTES = ["/admin/login", "/admin/invitation"];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  // Bootstrap des permissions au niveau admin : un seul fetch, cache partagé,
  // disponible immédiatement pour toutes les pages qui consomment usePermissions().
  const { loading: permissionsLoading } = usePermissions(!loading && !!user);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ADMIN_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isPublicRoute) {
      if (user) {
        router.replace("/admin/dashboard");
      }
      return;
    }

    if (!user) {
      router.replace("/admin/login");
    }
  }, [loading, user, isPublicRoute, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-on-surface">
        <p className="text-sm text-outline">Vérification de la session en cours...</p>
      </div>
    );
  }

  if (isPublicRoute) {
    if (user) {
      return null;
    }
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  // Permissions inconnues → aucune décision d'autorisation : on retient le
  // contenu protégé jusqu'à résolution de usePermissions().
  if (permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-on-surface">
        <p className="text-sm text-outline">Chargement des permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
