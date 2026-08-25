"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import MobileNav from "@/components/admin/layout/mobile-nav";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { useUsers } from "@/lib/hooks/users/useUsers";
import { getUserFacingError } from "@/lib/services/users.service";
import UsersStats from "@/components/admin/users/users-stats";
import UserCard from "@/components/admin/users/user-card";
import InviteAdminModal from "@/components/admin/users/invite-admin-modal";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const {
    users,
    loading,
    error,
    invite,
    changeRole,
    togglePermission,
    resetPermissions,
  } = useUsers();
  const { success, error: toastError } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentUser === null) return;
    if (currentUser?.role !== "SUPER_ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [currentUser, router]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await changeRole(id, role);
      success({ title: "Rôle mis à jour" });
    } catch (e) {
      toastError({
        title: "Modification échouée",
        description: getUserFacingError(e),
      });
    }
  };

  const handleTogglePermission = async (
    id: string,
    permission: string,
    granted: boolean,
  ) => {
    try {
      await togglePermission(id, permission, granted);
    } catch (e) {
      toastError({
        title: "Modification échouée",
        description: getUserFacingError(e),
      });
    }
  };

  const handleResetPermissions = async (id: string) => {
    try {
      await resetPermissions(id);
      success({ title: "Permissions réinitialisées" });
    } catch (e) {
      toastError({
        title: "Réinitialisation échouée",
        description: getUserFacingError(e),
      });
    }
  };

  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <MobileNav />
        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-outline">
                Super Admin Terminal
              </p>
              <h1 className="text-4xl font-headline font-bold">
                Gestion des Utilisateurs
              </h1>
            </div>
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-3 rounded-md hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined">person_add</span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Inviter un admin
              </span>
            </button>
          </div>

          {/* Stats */}
          <UsersStats users={users} />

          {/* Search */}
          <div className="mt-8 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou rôle..."
              className="w-full max-w-md bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-outline">Chargement des utilisateurs...</p>
            </div>
          )}

          {/* List */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <p className="text-outline text-center py-12">
                  Aucun utilisateur trouvé.
                </p>
              ) : (
                filteredUsers.map((u) => (
                  <UserCard
                    key={u.id}
                    user={u}
                    isCurrentUser={currentUser?.id === u.id}
                    onRoleChange={handleRoleChange}
                    onTogglePermission={handleTogglePermission}
                    onResetPermissions={handleResetPermissions}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <InviteAdminModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={invite}
      />
    </div>
  );
}
