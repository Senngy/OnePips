"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { getMyUserEffectivePermissions } from "@/lib/services/users.service";

// Clé unique partagée : la donnée est centralisée dans le cache React Query
// (un seul fetch, partagé entre tous les consommateurs de usePermissions()).
export const MY_PERMISSIONS_QUERY_KEY = ["my-effective-permissions"] as const;

export function usePermissions(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: MY_PERMISSIONS_QUERY_KEY,
    queryFn: getMyUserEffectivePermissions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });

  // Fail closed : tant que les permissions ne sont pas chargées, ou en cas
  // d'erreur, on ne suppose JAMAIS qu'une permission est présente.
  // permissions = [] → hasPermission()/hasAllPermissions() renvoient false.
  const permissions = query.data?.effectivePermissions ?? [];

  return {
    permissions,
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
    hasPermission: (permission: string) => permissions.includes(permission),
    hasAllPermissions: (perms: string[]) =>
      perms.every((p) => permissions.includes(p)),
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: MY_PERMISSIONS_QUERY_KEY }),
  };
}

// À appeler après toute mutation affectant les permissions (changement de
// rôle / override) pour forcer le rafraîchissement de l'état centralisé.
export function invalidateMyPermissions(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: MY_PERMISSIONS_QUERY_KEY });
}
