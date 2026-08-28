"use client";

import { useState } from "react";
import { ALL_ROLES, type UserWithPerms } from "@/lib/services/users.service";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";
import { useUpdateUserStatus } from "@/lib/hooks/users/useUpdateUsersStatus";
import { useToast } from "@/lib/hooks/useToast";
import Avatar from "./avatar";
import RoleBadge from "./role-badge";
import PermissionsPanel from "./permissions-panel";
import ConfirmModal from "@/components/modals/confirm-modal";

// Rôles proposés dans le select : hors SUPER_ADMIN (protégé) et CUSTOMER (public).
const SELECTABLE_ROLES = ALL_ROLES.filter(
  (r) => r !== "SUPER_ADMIN" && r !== "CUSTOMER",
);

export default function UserCard({
  user,
  isCurrentUser,
  onRoleChange,
  onTogglePermission,
  onResetPermissions,
}: {
  user: UserWithPerms;
  isCurrentUser: boolean;
  onRoleChange: (id: string, role: string) => void;
  onTogglePermission: (
    id: string,
    permission: string,
    granted: boolean,
  ) => void;
  onResetPermissions: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { hasPermission } = usePermissions();
  const { mutateAsync: updateStatus, isPending } = useUpdateUserStatus();
  const canManage = hasPermission("USERS_MANAGE");
  const canManageAdmin = hasPermission("ADMINS_MANAGE");
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const handleDisable = async () => {
    try {
      await updateStatus({
        userId: user.id,
        status: "DISABLED",
      });

      setOpenModal(false);
    } catch {
      // Le toast global/API error handling peut gérer l'erreur.
      // La modal reste ouverte.
    }
  };

  return (
    <>
      <div className="glass-card rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} />
            <div>
              <p className="font-headline font-bold text-on-surface text-lg flex items-center gap-2">
                {user.name || "Sans nom"}
                <RoleBadge role={user.role} />
              </p>
              <p className="text-sm text-outline">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin ? (
              <span className="text-xs text-outline/60 italic">
                Accès complet
              </span>
            ) : canManage ? (
              <select
                value={user.role}
                disabled={isCurrentUser}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-md px-3 py-1.5 text-sm text-on-surface focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {SELECTABLE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            ) : null}

            {!isSuperAdmin && canManage && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-primary hover:bg-primary/10"
              >
                {expanded ? "Fermer" : "Permissions"}
              </button>
            )}

            {canManageAdmin && !isCurrentUser && !isSuperAdmin && (
              <button
                title="Désactivation à venir (User.status)"
                className="px-3 py-1.5 text-sm font-bold rounded-lg border border-error/20 text-error hover:bg-error/10 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setOpenModal(true);
                }}
                disabled={isPending}
              >
                Désactiver
              </button>
            )}
          </div>
        </div>

        {expanded && !isSuperAdmin && (
          <PermissionsPanel
            user={user}
            onTogglePermission={onTogglePermission}
            onResetPermissions={onResetPermissions}
          />
        )}
      </div>
      <ConfirmModal
        open={openModal}
        title="Désactiver cet utilisateur ?"
        description={`L'utilisateur ${user.name || user.email} sera déconnecté immédiatement et ne pourra plus accéder à l'espace admin.`}
        confirmText="Désactiver"
        cancelText="Annuler"
        variant="danger"
        loading={isPending}
        onCancel={() => {
          if (!isPending) {
            setOpenModal(false);
          }
        }}
        onConfirm={handleDisable}
      />
    </>
  );
}
