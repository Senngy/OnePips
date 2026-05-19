"use client";
import { useState, FormEvent } from "react";
import { useCreateTestimonial } from "@/lib/hooks/community/useTestimonials";

export default function FormTestimony() {
    const { mutate: createTestimonial, isPending: creatingTestimonial } = useCreateTestimonial();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);


    const [testiForm, setTestiForm] = useState({
        name: "",
        role: "Membre Gold",
        rating: 5,
        content: ""
    });

    const isBusy = loading || creatingTestimonial;

    const handleTestimonialSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        createTestimonial(testiForm, {
            onSuccess: () => {
                setTestiForm({ name: "", role: "Membre Gold", rating: 5, content: "" });
                setSuccess(true);
                setLoading(false);
                setTimeout(() => setSuccess(false), 8000);
            },
            onError: (err) => {
                setError(err.message ?? "Une erreur est survenue. Veuillez réessayer.");
                setLoading(false);
            }
        });
    };

    return (
        <div className="glass-card p-8 rounded-xl border border-white/5 space-y-6">
            <div className="space-y-1">
                <h3 className="text-lg font-headline font-bold text-on-surface">Nouveau Témoignage</h3>
                <p className="text-xs text-outline">Ajouter manuellement un avis reçu.</p>
            </div>

            {/* ── Success banner ── */}
            {success && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary animate-fade-in">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <p className="text-xs font-medium">Témoignage enregistré avec succès !</p>
                </div>
            )}

            {/* ── Error banner ── */}
            {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-error/10 border border-error/20 text-error animate-fade-in">
                    <span className="material-symbols-outlined text-base shrink-0 mt-px" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    <p className="text-xs font-medium leading-relaxed">{error}</p>
                </div>
            )}

            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Nom Complet</label>
                    <input
                        required
                        disabled={isBusy}
                        value={testiForm.name}
                        onChange={e => setTestiForm({ ...testiForm, name: e.target.value })}
                        className="w-full bg-surface-container-lowest border-none ring-1 ring-white/10 focus:ring-primary text-sm rounded-md px-4 py-3 text-on-surface placeholder:text-outline/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="ex: Jean Dupont"
                        type="text"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Rôle / Badge</label>
                    <select
                        disabled={isBusy}
                        value={testiForm.role}
                        onChange={e => setTestiForm({ ...testiForm, role: e.target.value })}
                        className="w-full bg-surface-container-lowest border-none ring-1 ring-white/10 focus:ring-primary text-sm rounded-md px-4 py-3 text-on-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="Membre Gold">Membre Gold</option>
                        <option value="Elite Trader">Elite Trader</option>
                        <option value="Beginner">Beginner</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Évaluation (1-5)</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                onClick={() => !isBusy && setTestiForm({ ...testiForm, rating: star })}
                                className={`material-symbols-outlined transition-transform ${isBusy ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"} ${star <= testiForm.rating ? "text-primary" : "text-outline"}`}
                                style={{ fontVariationSettings: star <= testiForm.rating ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                star
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Témoignage</label>
                    <textarea
                        required
                        disabled={isBusy}
                        value={testiForm.content}
                        onChange={e => setTestiForm({ ...testiForm, content: e.target.value })}
                        className="w-full bg-surface-container-lowest border-none ring-1 ring-white/10 focus:ring-primary text-sm rounded-md px-4 py-3 text-on-surface placeholder:text-outline/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Tapez ici le contenu du message..."
                        rows={4}
                    />
                </div>

                <button
                    disabled={isBusy}
                    className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-3 rounded-md font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    type="submit"
                >
                    {isBusy ? (
                        <>
                            {/* Spinner */}
                            <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z" />
                            </svg>
                            ENREGISTREMENT...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-base">save</span>
                            ENREGISTRER L&apos;AVIS
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}