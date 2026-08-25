import { api, ApiError } from "../api-client";

export type UserWithPerms = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  permissions: { permission: string; granted: boolean }[];
  effectivePermissions: string[];
};

export type PermissionOverride = {
  permission: string;
  granted: boolean;
};

// Constantes d'AFFICHAGE uniquement — jamais une autorité de sécurité.
// Le backend valide réellement rôle/permissions ; ces listes servent à construire l'UI.
export const ALL_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "EDITOR",
  "VIEWER",
  "CUSTOMER",
];

export const ALL_PERMISSIONS = [
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

export const getUsersWithPermissions = () =>
  api<UserWithPerms[]>("/users/permissions");

export const inviteAdmin = (email: string) => {
  
  if (email) {
    console.log("[inviteAdmin] email:", email);
  } else {
    console.error("[inviteAdmin] email is required");
  }
  const data =  api<{
    id: string;
    email: string;
    role: "ADMIN";
    expiresAt: string;
  }>("/users/invitations", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  console.log("[inviteAdmin] data:", data);
  return data;
}
export const updateUserRole = (id: string, role: string) =>
  api(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const updateUserPermissions = (
  id: string,
  overrides: PermissionOverride[],
) =>
  api(`/users/${id}/permissions`, {
    method: "PATCH",
    body: JSON.stringify({ permissions: overrides }),
  });

export const resetUserPermissions = (id: string) =>
  api(`/users/${id}/permissions`, { method: "DELETE" });

export const completeInvitation = (
  token: string,
  password: string,
  name?: string,
) =>
  api(`/users/invitations/${token}/complete`, {
    method: "POST",
    body: JSON.stringify({ password, name }),
  });

// Code connu → message dédié. Code inconnu → message générique + référence.
// N'expose jamais `details` ni le texte backend brut.
export function getUserFacingError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "ADMIN_INVITATION_EMAIL_EXISTS":
        return "Un compte existe déjà avec cet email.";
      case "ADMIN_INVITATION_NOT_FOUND":
        return "Invitation introuvable.";
      case "ADMIN_INVITATION_EXPIRED":
        return "Cette invitation a expiré.";
      case "ADMIN_INVITATION_ALREADY_USED":
        return "Cette invitation a déjà été utilisée.";
      case "VALIDATION_ERROR":
        return "Les données saisies sont invalides.";
      case "FORBIDDEN":
      case "AUTHZ_PERMISSION_INSUFFICIENT":
        return "Vous n'avez pas les droits pour effectuer cette action.";
      default:
        return `Une erreur est survenue${error.requestId ? ` (référence : ${error.requestId})` : ""}.`;
    }
  }
  return "Une erreur inattendue est survenue.";
}
