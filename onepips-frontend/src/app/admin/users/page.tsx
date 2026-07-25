"use client";

import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import MobileNav from "@/components/admin/layout/mobile-nav";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";

const ALL_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR", "VIEWER", "CUSTOMER"];
const ALL_PERMISSIONS = [
  { group: "Leads", perms: ["LEADS_READ", "LEADS_WRITE", "LEADS_DELETE"] },
  { group: "Applications", perms: ["APPLICATIONS_READ", "APPLICATIONS_WRITE"] },
  { group: "Bookings", perms: ["BOOKINGS_READ", "BOOKINGS_WRITE"] },
  { group: "Payments", perms: ["PAYMENTS_READ", "PAYMENTS_WRITE"] },
  { group: "Events", perms: ["EVENTS_READ", "EVENTS_WRITE", "EVENTS_DELETE"] },
  { group: "Community", perms: ["COMMUNITY_READ", "COMMUNITY_WRITE"] },
  { group: "Settings", perms: ["SETTINGS_MANAGE"] },
  { group: "Users", perms: ["USERS_READ", "USERS_MANAGE"] },
  { group: "Admin", perms: ["ADMINS_MANAGE", "ROLES_MANAGE"] },
  { group: "Files", perms: ["FILES_UPLOAD"] },
];

type UserWithPerms = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  permissions: { permission: string; granted: boolean }[];
  effectivePermissions: string[];
};

type PermissionOverride = {
  permission: string;
  granted: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithPerms[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api("/users/permissions");
      setUsers(data);
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err: any) {
      alert(err?.message ?? "Erreur lors du changement de rôle");
    }
  };

  const handlePermissionToggle = async (
    userId: string,
    permission: string,
    granted: boolean,
  ) => {
    const overrides: PermissionOverride[] = [{ permission, granted }];

    try {
      await api(`/users/${userId}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permissions: overrides }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
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
    } catch (err: any) {
      alert(err?.message ?? "Erreur lors de la modification");
    }
  };

  const handleResetPermissions = async (userId: string) => {
    try {
      await api(`/users/${userId}/permissions`, { method: "DELETE" });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, permissions: [] } : u,
        ),
      );
    } catch (err: any) {
      alert(err?.message ?? "Erreur lors de la réinitialisation");
    }
  };

  const getOverrideStatus = (
    user: UserWithPerms,
    permission: string,
  ): { status: "inherited" | "granted" | "denied" | "none"; override?: boolean } => {
    const override = user.permissions.find((p) => p.permission === permission);
    if (override) {
      return { status: override.granted ? "granted" : "denied", override: override.granted };
    }
    const has = user.effectivePermissions.includes(permission);
    return { status: has ? "inherited" : "none" };
  };

  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <MobileNav />
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-headline font-bold">Gestion des Utilisateurs</h1>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              type="button"
            >
              Actualiser
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-outline">Chargement des utilisateurs...</p>
            </div>
          )}

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-surface-container rounded-xl border border-outline-variant/10 overflow-hidden"
                >
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-headline font-bold text-on-surface text-lg">
                        {user.name || "Sans nom"}
                      </p>
                      <p className="text-sm text-outline">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-surface-container-lowest border border-outline-variant/20 rounded-md px-3 py-1.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        {ALL_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          setExpandedUser(expandedUser === user.id ? null : user.id)
                        }
                        className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        type="button"
                      >
                        {expandedUser === user.id ? "Fermer" : "Permissions"}
                      </button>
                      <button
                        onClick={() => handleResetPermissions(user.id)}
                        className="px-3 py-1.5 text-sm font-medium text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        type="button"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>

                  {expandedUser === user.id && (
                    <div className="border-t border-outline-variant/10 p-6 bg-surface-container-low">
                      <p className="text-sm font-medium text-outline mb-1">
                        Rôle actuel : <span className="text-on-surface font-bold">{user.role}</span>
                      </p>
                      <p className="text-xs text-outline mb-4">
                        ✅ Hérité du rôle &nbsp;|&nbsp; ⚡ Accordé explicitement &nbsp;|&nbsp; ✕ Refusé explicitement &nbsp;|&nbsp; ❌ Non accordé
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ALL_PERMISSIONS.map((group) => (
                          <div key={group.group} className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-outline">
                              {group.group}
                            </p>
                            {group.perms.map((perm) => {
                              const { status } = getOverrideStatus(user, perm);

                              const icon =
                                status === "inherited" ? "✅" :
                                status === "granted" ? "⚡" :
                                status === "denied" ? "✕" : "❌";

                              const label =
                                status === "inherited" ? "Hérité" :
                                status === "granted" ? "Accordé" :
                                status === "denied" ? "Refusé" : "Non accordé";

                              const isOverride = status === "granted" || status === "denied";
                              const currentValue = isOverride
                                ? user.permissions.find((p) => p.permission === perm)?.granted
                                : user.effectivePermissions.includes(perm);

                              return (
                                <label
                                  key={perm}
                                  className="flex items-center gap-2 cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    checked={currentValue ?? false}
                                    onChange={() =>
                                      handlePermissionToggle(
                                        user.id,
                                        perm,
                                        !(currentValue ?? false),
                                      )
                                    }
                                    className="rounded border-outline-variant/30 text-primary focus:ring-primary"
                                  />
                                  <span className="text-xs text-outline group-hover:text-on-surface transition-colors flex-1">
                                    {perm.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-[10px] font-medium opacity-60" title={label}>
                                    {icon}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
