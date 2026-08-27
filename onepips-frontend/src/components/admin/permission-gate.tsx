"use client";

import { ReactNode } from "react";
import AccessDenied from "@/components/admin/access-denied";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

// Garde de page générique : ne monte `children` que si la permission requise
// est présente. Tant que les permissions sont inconnues → aucun contenu métier
// monté, donc aucun fetch API inutile.
export default function PermissionGate({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { loading, hasPermission } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24">
        <span className="material-symbols-outlined animate-spin text-outline text-2xl">
          progress_activity
        </span>
        <span className="text-sm text-outline">Chargement...</span>
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
