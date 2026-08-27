"use client";

import { ALL_PERMISSIONS, type UserWithPerms } from "@/lib/services/users.service";

type Status = "inherited" | "granted" | "denied" | "none";

// Dérive la permission READ parente d'une permission WRITE/DELETE.
// Ex : LEADS_WRITE → LEADS_READ · LEADS_DELETE → LEADS_READ.
// Retourne null pour les permissions non-CRUD (SETTINGS_MANAGE, USERS_MANAGE,
// ADMINS_MANAGE, ROLES_MANAGE, FILES_UPLOAD) et pour les READ elles-mêmes.
function getDependentRead(permission: string): string | null {
  if (permission.endsWith("_WRITE") || permission.endsWith("_DELETE")) {
    return permission.replace(/_(WRITE|DELETE)$/, "_READ");
  }
  return null;
}

export default function PermissionsPanel({
  user,
  onTogglePermission,
  onResetPermissions,
}: {
  user: UserWithPerms;
  onTogglePermission: (id: string, permission: string, granted: boolean) => void;
  onResetPermissions: (id: string) => void;
}) {
  const getStatus = (permission: string): Status => {
    const override = user.permissions.find((p) => p.permission === permission);
    if (override) return override.granted ? "granted" : "denied";
    return user.effectivePermissions.includes(permission) ? "inherited" : "none";
  };

  return (
    <div className="border-t border-outline-variant/10 p-6 bg-surface-container-low">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-outline">
          Rôle actuel :{" "}
          <span className="text-on-surface font-bold">{user.role}</span>
        </p>
        <button
          onClick={() => onResetPermissions(user.id)}
          className="text-xs font-bold text-error/70 hover:text-error transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <p className="text-xs text-outline mb-4">
        ✅ Hérité du rôle · ⚡ Accordé explicitement · ✕ Refusé explicitement ·
        ❌ Non accordé · ⚠️ Impossible sans la permission de lecture
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_PERMISSIONS.map((group) => (
          <div key={group.group} className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-outline">
              {group.group}
            </p>
            {group.perms.map((perm) => {
              const status = getStatus(perm);
              const isOverride = status === "granted" || status === "denied";
              const checked = isOverride
                ? (user.permissions.find((p) => p.permission === perm)?.granted ??
                  false)
                : user.effectivePermissions.includes(perm);

              // Dépendance WRITE/DELETE → READ : si la READ est absente,
              // la permission est visuellement indisponible (override conservé).
              const dependentRead = getDependentRead(perm);
              const isBlocked =
                dependentRead !== null &&
                !user.effectivePermissions.includes(dependentRead);

              const icon = isBlocked
                ? "⚠️"
                : status === "inherited"
                  ? "✅"
                  : status === "granted"
                    ? "⚡"
                    : status === "denied"
                      ? "✕"
                      : "❌";

              const title = isBlocked
                ? `Impossible sans ${dependentRead?.replace(/_/g, " ")}`
                : status;

              return (
                <label
                  key={perm}
                  className={`flex items-center gap-2 group ${
                    isBlocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isBlocked}
                    onChange={() =>
                      onTogglePermission(user.id, perm, !checked)
                    }
                    className="rounded border-outline-variant/30 text-primary focus:ring-primary disabled:cursor-not-allowed"
                  />
                  <span className="text-xs text-outline group-hover:text-on-surface transition-colors flex-1">
                    {perm.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-medium opacity-60" title={title}>
                    {icon}
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
