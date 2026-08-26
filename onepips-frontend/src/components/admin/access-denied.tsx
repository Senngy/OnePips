"use client";

import { ApiError } from "@/lib/api-client";

export function isForbiddenError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.statusCode === 403 ||
      error.code === "FORBIDDEN" ||
      error.code === "AUTHZ_PERMISSION_INSUFFICIENT" ||
      error.code === "AUTHZ_ROLE_INSUFFICIENT")
  );
}

export default function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="bg-surface-container rounded-xl border border-outline-variant/10 p-10 max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-error text-4xl">
            lock
          </span>
        </div>
        <h1 className="text-2xl font-headline font-bold">Accès refusé</h1>
        <p className="text-sm text-outline">
          Vous ne disposez pas des droits nécessaires pour accéder à cette
          ressource.
        </p>
      </div>
    </div>
  );
}
