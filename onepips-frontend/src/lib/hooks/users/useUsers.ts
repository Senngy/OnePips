"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsersWithPermissions,
  inviteAdmin,
  updateUserRole,
  updateUserPermissions,
  resetUserPermissions,
  getUserFacingError,
} from "@/lib/services/users.service";
import { invalidateMyPermissions, usePermissions } from "@/lib/hooks/permissions/usePermissions";

export const USERS_QUERY_KEY = ["users-permissions"] as const;

export function useUsers() {
  const queryClient = useQueryClient();
  const { loading: permissionsLoading, hasPermission } = usePermissions();

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsersWithPermissions,
    enabled: !permissionsLoading && hasPermission("USERS_READ"),
  });

  // Après mutation : recharge la liste + invalide les effectivePermissions
  // de l'utilisateur courant (dépendances WRITE/DELETE → READ recalculées).
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
      invalidateMyPermissions(queryClient),
    ]);

  const inviteMutation = useMutation({
    mutationFn: (email: string) => inviteAdmin(email),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => refresh(),
  });

  const togglePermissionMutation = useMutation({
    mutationFn: ({
      id,
      permission,
      granted,
    }: {
      id: string;
      permission: string;
      granted: boolean;
    }) => updateUserPermissions(id, [{ permission, granted }]),
    onSuccess: () => refresh(),
  });

  const resetPermissionsMutation = useMutation({
    mutationFn: (id: string) => resetUserPermissions(id),
    onSuccess: () => refresh(),
  });

  return {
    users: usersQuery.data ?? [],
    loading: usersQuery.isLoading,
    error: usersQuery.error ? getUserFacingError(usersQuery.error) : null,
    refetch: usersQuery.refetch,
    invite: async (email: string) => {
      await inviteMutation.mutateAsync(email);
    },
    changeRole: (id: string, role: string) =>
      changeRoleMutation.mutateAsync({ id, role }),
    togglePermission: (id: string, permission: string, granted: boolean) =>
      togglePermissionMutation.mutateAsync({ id, permission, granted }),
    resetPermissions: (id: string) =>
      resetPermissionsMutation.mutateAsync(id),
  };
}
