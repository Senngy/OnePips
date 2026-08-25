"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getUsersWithPermissions,
  inviteAdmin,
  updateUserRole,
  updateUserPermissions,
  resetUserPermissions,
  getUserFacingError,
  type UserWithPerms,
  type PermissionOverride,
} from "@/lib/services/users.service";

export function useUsers() {
  const [users, setUsers] = useState<UserWithPerms[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsersWithPermissions();
      setUsers(data);
    } catch (e) {
      setError(getUserFacingError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const invite = async (email: string) => {
    await inviteAdmin(email);
    await fetchUsers();
  };

  const changeRole = async (id: string, role: string) => {
    await updateUserRole(id, role);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u)),
    );
  };

  const togglePermission = async (
    id: string,
    permission: string,
    granted: boolean,
  ) => {
    const overrides: PermissionOverride[] = [{ permission, granted }];
    await updateUserPermissions(id, overrides);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              permissions: [
                ...u.permissions.filter((p) => p.permission !== permission),
                { permission, granted },
              ],
            }
          : u,
      ),
    );
  };

  const resetPermissions = async (id: string) => {
    await resetUserPermissions(id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, permissions: [] } : u)),
    );
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    invite,
    changeRole,
    togglePermission,
    resetPermissions,
  };
}
