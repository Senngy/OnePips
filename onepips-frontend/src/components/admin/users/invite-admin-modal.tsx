"use client";

import { useState } from "react";
import { useToast } from "@/lib/hooks/useToast";
import { getUserFacingError } from "@/lib/services/users.service";

export default function InviteAdminModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
}) {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email.trim()) {
      error({
        title: "Email requis",
        description: "Veuillez saisir une adresse email.",
      });
      return;
    }
    setLoading(true);
    try {
      await onInvite(email.trim());
      success({
        title: "Invitation envoyée",
        description: `Un email a été envoyé à ${email.trim()}.`,
      });
      setEmail("");
      onClose();
    } catch (e) {
      error({
        title: "Invitation échouée",
        description: getUserFacingError(e),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-surface-container p-6 shadow-xl border border-outline-variant/10">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold">Inviter un administrateur</h2>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <p className="text-sm text-outline mb-6">
          Le nouvel admin recevra un lien par email pour définir son mot de
          passe et activer son compte.
        </p>

        <label className="text-xs font-bold uppercase tracking-wider text-outline">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSubmit();
          }}
          placeholder="admin@onepips.com"
          className="mt-2 w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-surface-variant text-on-surface text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md text-sm font-bold bg-primary-container text-on-primary-container disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer l'invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
