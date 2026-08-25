"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeInvitation, getUserFacingError } from "@/lib/services/users.service";

export default function InvitationForm({ token }: { token: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await completeInvitation(token, password, name.trim() || undefined);
      setSuccess(true);
    } catch (err) {
      setError(getUserFacingError(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-on-surface px-6">
        <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-4xl">
              check_circle
            </span>
          </div>
          <h1 className="text-2xl font-headline font-bold">Compte activé</h1>
          <p className="text-sm text-outline">
            Votre compte administrateur a été activé. Vous pouvez maintenant
            vous connecter.
          </p>
          <button
            onClick={() => router.replace("/admin/login")}
            className="w-full py-3 bg-primary-container text-on-primary-container font-bold rounded-md hover:brightness-110 transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-on-surface px-6">
      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 max-w-md w-full space-y-6">
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight">
            Activer votre compte admin
          </h1>
          <p className="text-sm text-outline mt-1">
            Définissez votre nom et votre mot de passe pour activer votre
            compte administrateur.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-outline">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-outline">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-outline">
              Confirmation
            </label>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Répétez le mot de passe"
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-md p-3">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-container text-on-primary-container font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Activation..." : "Activer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
