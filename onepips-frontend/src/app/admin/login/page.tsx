"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/hooks/useToast";

const gridStyle = {
  backgroundImage:
    "linear-gradient(to right, rgba(74, 68, 85, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(74, 68, 85, 0.1) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      error({
        title: "Champs incomplets",
        description: "Veuillez renseigner votre email et votre mot de passe.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe: remember,
      });

      if (result?.error) {
        throw new Error(result.error.message || "Échec de la connexion");
      }

      success({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à l’espace admin.",
      });

      router.push("/admin/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur inattendue est survenue.";
      error({
        title: "Connexion impossible",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-on-surface relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={gridStyle} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-64 h-64 border border-outline-variant/10 rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 border border-outline-variant/5 rounded-full" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield_with_heart
                </span>
              </div>
              <h1 className="font-headline text-2xl font-bold tracking-tighter text-on-surface">
                One Pips Admin <span className="text-primary font-light opacity-50 ml-1">/ Obsidian Pulse</span>
              </h1>
            </div>
            <div className="h-[1px] w-12 bg-primary-container mx-auto mb-6" />
            <h2 className="font-headline text-3xl font-bold tracking-tight">Accès Terminal</h2>
            <p className="text-outline text-sm max-w-[280px] mx-auto leading-relaxed">
              Authentification sécurisée requise pour les opérateurs Elite.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/20 bg-[rgba(31,31,35,0.6)] backdrop-blur-xl p-8 relative overflow-hidden">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[10px] font-label uppercase tracking-[0.2em] text-outline font-bold ml-1">
                  Identifiant Opérateur
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
                    person
                  </span>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all duration-300 font-body text-sm"
                    placeholder="admin@onepips.com"
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="block text-[10px] font-label uppercase tracking-[0.2em] text-outline font-bold ml-1">
                    Clé de Sécurité
                  </label>
                  <a className="text-[10px] font-label uppercase tracking-wider text-primary-fixed-dim hover:text-primary transition-colors" href="#">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all duration-300 font-body text-sm"
                    placeholder="••••••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  className="w-4 h-4 rounded border-outline-variant/20 bg-surface-container-lowest text-primary-container focus:ring-primary-container focus:ring-offset-background cursor-pointer"
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <label className="text-xs text-outline cursor-pointer select-none" htmlFor="remember">
                  Maintenir la session active (24h)
                </label>
              </div>

              <button
                className="w-full py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-md shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:bg-primary-container/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se Connecter</span>
                    <span className="material-symbols-outlined text-xl">login</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between border-t border-outline-variant/10 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-label text-outline uppercase tracking-widest">
                  Système Opérationnel
                </span>
              </div>
              <span className="text-[10px] font-label text-outline uppercase tracking-widest">
                v4.2.0-Elite
              </span>
            </div>
          </div>

          <footer className="mt-12 text-center space-y-4">
            <div className="flex justify-center gap-6 text-outline/40 text-[10px] font-label uppercase tracking-[0.15em]">
              <span className="hover:text-primary-fixed-dim transition-colors cursor-pointer">Privacy Protocol</span>
              <span className="hover:text-primary-fixed-dim transition-colors cursor-pointer">SLA Agreement</span>
              <span className="hover:text-primary-fixed-dim transition-colors cursor-pointer">Global Nodes</span>
            </div>
            <p className="text-outline/30 text-[11px] font-body">One Pips © 2024 - Système de trading propriétaire.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
