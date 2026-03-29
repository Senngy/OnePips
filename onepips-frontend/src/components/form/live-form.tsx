"use-client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLead, updateLead, CreateLeadDto } from "@/lib/services/leads.service";
import { createApplication } from "@/lib/services/applications.service";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function LiveForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateLeadDto>({
        name: "",
        email: "",
        phone: "",
        tradingYears: 0,
    });
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const lead = await createLead(formData);
            setSuccess(true);
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
                <select className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary-fixed-dim transition-all appearance-none outline-none">
                    <option value={formData.tradingYears = 0}>Débutant (0-1 an)</option>
                    <option value={formData.tradingYears = 2}>Intermédiaire (1-3 ans)</option>
                    <option value={formData.tradingYears = 4}>Avancé (3+ ans)</option>
                </select>
            </div>
            <button
                className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-md mt-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)]"
                onClick={handleSubmit}
                type="button"
            >
                RÉSERVER MON ACCÈS
            </button>
            <p className="text-[9px] text-center text-outline/60 px-4 font-label">
                En vous inscrivant, vous acceptez de recevoir nos analyses hebdomadaires et invitations exclusives.
            </p>
        </form>
    );
}
