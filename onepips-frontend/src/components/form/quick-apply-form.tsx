"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createDirectApplication } from "@/lib/services/applications.service";
import { ApiError } from "@/lib/api-client";
import { detectSource } from "@/lib/helpers/detectSource";
import Turnstile from "@/components/ui/turnstile";

const TOTAL_STEPS = 3;

const STEPS_INFO = [
    { id: "01", title: "Profil & Contact", label: "Profil" },
    { id: "02", title: "Ton Expérience", label: "Expérience" },
    { id: "03", title: "Validation", label: "Validation" },
];

export default function QuickApplyForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [cfToken, setCfToken] = useState<string>("");
    const [consent, setConsent] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        tradingYears: 0,
        interests: [] as string[],
        budgetFormation: 0,
        budgetTrading: 0,
        markets: [] as string[],
        accountType: [] as string[],
    });

    const progress = (step / TOTAL_STEPS) * 100;

    const next = () => {
        if (step === 1 && (!form.name || !form.email)) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        setError(null);
        setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };

    const prev = () => setStep((s) => Math.max(s - 1, 1));

    const toggleInterest = (value: string) => {
        setForm((prev) => ({
            ...prev,
            interests: prev.interests.includes(value)
                ? prev.interests.filter((i) => i !== value)
                : [...prev.interests, value],
        }));
    };

    const toggleMarket = (value: string) => {
        setForm((prev) => ({
            ...prev,
            markets: prev.markets.includes(value)
                ? prev.markets.filter((i) => i !== value)
                : [...prev.markets, value],
        }));
    };

    const toggleAccountType = (value: string) => {
        setForm((prev) => ({
            ...prev,
            accountType: prev.accountType.includes(value)
                ? prev.accountType.filter((i) => i !== value)
                : [...prev.accountType, value],
        }));
    };

    const handleSubmit = async () => {
        if (!consent) {
            setError("Veuillez accepter les conditions de traitement de vos données.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createDirectApplication({
                ...form,
                source: detectSource(),
                cfTurnstileToken: cfToken,
            });
            setSuccess(true);
        } catch (e: unknown) {
            if (e instanceof ApiError) {
                if (e.status === 409) {
                    setError("Vous avez déjà soumis une candidature. Notre équipe va vous recontacter sous 48h.");
                } else {
                    setError(e.message);
                }
            } else {
                setError("Une erreur inattendue est survenue.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-surface-container p-8 md:p-12 rounded-xl glass-highlight shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                </div>
                <h2 className="font-headline text-3xl font-bold text-on-surface">Candidature Envoyée !</h2>
                <p className="text-on-surface-variant max-w-md mx-auto">
                    Merci pour votre intérêt. Notre équipe va examiner votre profil et vous recontactera sous 48h.
                </p>
                <Button
                    className="bg-primary-container text-on-primary-container hover:scale-[1.02] transition-transform"
                    onClick={() => window.location.href = "/"}
                >
                    Retour à l'accueil
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Stepper */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Étape {STEPS_INFO[step - 1].id}/0{TOTAL_STEPS}</span>
                        <h2 className="font-headline text-2xl font-bold text-on-surface">{STEPS_INFO[step - 1].title}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-on-surface-variant font-mono">{Math.round(progress)}% Complété</span>
                    </div>
                </div>
                <div className="h-1 w-full bg-secondary-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary glow-indicator transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center px-1">
                    {STEPS_INFO.map((s, i) => (
                        <div key={s.id} className={cn("flex flex-col items-center gap-2 transition-opacity", step < i + 1 && "opacity-30")}>
                            <div className={cn("w-2 h-2 rounded-full", step >= i + 1 ? "bg-primary glow-indicator" : "bg-outline")}></div>
                            <span className={cn("font-label text-[9px] uppercase tracking-tighter", step >= i + 1 ? "text-on-surface" : "text-outline")}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-surface-container p-8 md:p-12 rounded-xl glass-highlight shadow-2xl">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2 col-span-full">
                                <label className="font-label text-[10px] uppercase tracking-widest text-outline">Nom Complet</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                                    <input
                                        className="w-full sunken-field border-outline-variant/15 focus:border-primary-fixed-dim focus:ring-0 text-on-surface placeholder:text-outline-variant/40 rounded-md py-4 pl-12 transition-all"
                                        placeholder="Ex: Jean Dupont"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label text-[10px] uppercase tracking-widest text-outline">Adresse Email</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                                    <input
                                        className="w-full sunken-field border-outline-variant/15 focus:border-primary-fixed-dim focus:ring-0 text-on-surface placeholder:text-outline-variant/40 rounded-md py-4 pl-12 transition-all"
                                        placeholder="nom@exemple.com"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label text-[10px] uppercase tracking-widest text-outline">WhatsApp (Optionnel)</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">chat_bubble</span>
                                    <input
                                        className="w-full sunken-field border-outline-variant/15 focus:border-primary-fixed-dim focus:ring-0 text-on-surface placeholder:text-outline-variant/40 rounded-md py-4 pl-12 transition-all"
                                        placeholder="+33 6 00 00 00 00"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <label className="font-label text-[10px] uppercase tracking-widest text-outline">Années de trading</label>
                                <input
                                    type="range" min="0" max="10" step="1"
                                    className="w-full h-1 bg-secondary-container rounded-full appearance-none cursor-pointer accent-primary"
                                    value={form.tradingYears}
                                    onChange={(e) => setForm({ ...form, tradingYears: Number(e.target.value) })}
                                />
                                <div className="flex justify-between text-[10px] text-outline-variant font-mono">
                                    <span>Débutant</span>
                                    <span className="text-primary font-bold">{form.tradingYears} ans</span>
                                    <span>Expert</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="font-label text-[10px] uppercase tracking-widest text-outline">Marchés favoris</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["CFD", "CRYPTO", "FUTURES"].map((item) => (
                                        <button key={item} type="button" onClick={() => toggleMarket(item)}
                                            className={cn("py-3 px-2 rounded-md border transition-all text-[9px] font-bold tracking-widest uppercase text-center",
                                                form.markets.includes(item as any)
                                                    ? "bg-primary-container text-on-primary-container border-primary shadow-lg shadow-primary/20"
                                                    : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary/50"
                                            )}>
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="font-label text-[10px] uppercase tracking-widest text-outline">Ce qui vous intéresse</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "LIVES_SUBSCRIPTION", label: "COURS" },
                                        { value: "SIGNALS", label: "SIGNAUX" },
                                        { value: "PRIVATE_COACHING", label: "ACCOMPAGNEMENT" },
                                        { value: "ONE_TO_ONE", label: "ONE TO ONE" }
                                    ].map((item) => (
                                        <button key={item.value} type="button" onClick={() => toggleInterest(item.value)}
                                            className={cn("py-3 px-4 rounded-md border transition-all text-[10px] font-bold tracking-widest uppercase text-center flex items-center justify-center",
                                                form.interests.includes(item.value)
                                                    ? "bg-primary-container text-on-primary-container border-primary shadow-lg shadow-primary/20"
                                                    : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary/50"
                                            )}>
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="font-label text-[10px] uppercase tracking-widest text-outline">Budget Formation (€)</label>
                                    <input className="w-full sunken-field border-outline-variant/15 focus:border-primary-fixed-dim focus:ring-0 text-on-surface placeholder:text-outline-variant/40 rounded-md py-4 px-6 transition-all"
                                        type="number" placeholder="Ex: 1500" value={form.budgetFormation || ""}
                                        onChange={(e) => setForm({ ...form, budgetFormation: Number(e.target.value) }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label text-[10px] uppercase tracking-widest text-outline">Capital Trading (€)</label>
                                    <input className="w-full sunken-field border-outline-variant/15 focus:border-primary-fixed-dim focus:ring-0 text-on-surface placeholder:text-outline-variant/40 rounded-md py-4 px-6 transition-all"
                                        type="number" placeholder="Ex: 5000" value={form.budgetTrading || ""}
                                        onChange={(e) => setForm({ ...form, budgetTrading: Number(e.target.value) }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-6 bg-surface-container-lowest rounded-lg border border-outline-variant/10 space-y-4">
                                <div className="flex justify-between items-center border-b border-outline-variant/5 pb-3">
                                    <span className="text-[10px] text-outline uppercase tracking-widest">Nom</span>
                                    <span className="text-sm font-bold text-on-surface">{form.name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-outline-variant/5 pb-3">
                                    <span className="text-[10px] text-outline uppercase tracking-widest">Email</span>
                                    <span className="text-sm font-bold text-on-surface">{form.email}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-outline-variant/5 pb-3">
                                    <span className="text-[10px] text-outline uppercase tracking-widest">Expérience</span>
                                    <span className="text-sm font-bold text-on-surface">{form.tradingYears} ans</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-outline uppercase tracking-widest">Intérêts</span>
                                    <span className="text-[10px] font-bold text-primary">{form.interests.join(", ") || "Non spécifié"}</span>
                                </div>
                            </div>

                            <Turnstile onToken={setCfToken} />

                            <label className="flex items-start gap-3 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 cursor-pointer">
                                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary" />
                                <span className="text-[11px] text-on-surface-variant leading-relaxed">
                                    J&apos;accepte que mes données soient traitées conformément à la{" "}
                                    <a href="/legal/privacy" target="_blank" className="text-primary underline">politique de confidentialité</a>.
                                </span>
                            </label>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-error-container/20 border border-error/20 text-error rounded-md text-xs flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm shrink-0">error</span>
                            {error}
                        </div>
                    )}

                    <div className="pt-8 flex items-center justify-between border-t border-outline-variant/10">
                        <button type="button"
                            className={cn("flex items-center gap-2 text-outline-variant hover:text-on-surface transition-colors uppercase tracking-[0.2em] text-[10px] font-bold", step === 1 && "invisible")}
                            onClick={prev}>
                            <span className="material-symbols-outlined text-sm">arrow_back</span> Retour
                        </button>
                        <button type="button" disabled={loading}
                            className={cn("group relative inline-flex items-center justify-center px-10 py-4 font-headline font-bold text-on-primary-container bg-primary-container rounded-md overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-container/20 disabled:opacity-50",
                                loading && "cursor-not-allowed")}
                            onClick={step === TOTAL_STEPS ? handleSubmit : next}>
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin"></span>
                                ) : step === TOTAL_STEPS ? "Confirmer la Candidature" : "Continuer"}
                                {!loading && step < TOTAL_STEPS && (
                                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                                )}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
