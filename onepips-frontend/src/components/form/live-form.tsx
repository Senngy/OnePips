"use client"

import { useState } from "react";
import { CreateLeadDto, createLead } from "@/lib/services/leads.service";
import { addParticipantToEvent } from "@/lib/services/events.service";
import { ApiError } from "@/lib/api-client";
import Turnstile from "@/components/ui/turnstile";

interface LiveFormProps {
    eventId?: string;
}

export function LiveForm({
    eventId
}: LiveFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cfToken, setCfToken] = useState<string>("");
    const [formData, setFormData] = useState<CreateLeadDto>({
        name: "",
        email: "",
        phone: "",
        tradingYears: 0,
        source: "live_form",
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = { ...formData, cfTurnstileToken: cfToken };
            if (eventId) {
                await addParticipantToEvent(eventId, payload);
                setSuccess(true);
            } else {
                await createLead(payload);
                setSuccess(true);
            }
        } catch (e) {
            console.error(e);
            if (e instanceof ApiError) {
                setError(e.message);
            } else {
                setError("Une erreur est survenue");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <form action="#" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Nom complet</label>
                <input
                    className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none"
                    placeholder="Alexandre Martin"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Email professionnel</label>
                <input
                    className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none"
                    placeholder="alex@premium.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Whatsapp</label>
                <input
                    className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none"
                    placeholder="+33 6 00 00 00 00"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Expérience</label>
                <select
                    value={formData.tradingYears}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            tradingYears: Number(e.target.value),
                        })
                    }
                >
                    <option value={0}>Débutant (0-1 an)</option>
                    <option value={2}>Intermédiaire (1-3 ans)</option>
                    <option value={4}>Avancé (3+ ans)</option>
                </select>
            </div>
            {error && <p className="text-red-500 text-center text-sm font-medium p-2 bg-red-500/10 rounded-md mt-2">{error}</p>}
            <div className="flex justify-center">
                <Turnstile onToken={setCfToken} />
            </div>
            {success ? (
                <div className="text-center mt-4 p-6 bg-primary/10 border border-primary/30 rounded-xl space-y-3">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <p className="text-primary font-bold font-headline text-lg">Inscription confirmée !</p>
                    <p className="text-primary/80 text-xs">Vous recevrez vos accès par email dès l&apos;ouverture de la session.</p>
                </div>
            ) : (
                <button
                    className="w-full relative flex items-center justify-center gap-2 bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-md mt-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:brightness-100"
                    onClick={handleSubmit}
                    type="button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                            <span>RÉSERVATION...</span>
                        </>
                    ) : (
                        <span>RÉSERVER MON ACCÈS</span>
                    )}
                </button>
            )}
            <p className="text-[9px] text-center text-outline/60 px-4 font-label">
                En vous inscrivant, vous acceptez de recevoir nos analyses hebdomadaires et invitations exclusives.
            </p>
        </form>
    );
}
