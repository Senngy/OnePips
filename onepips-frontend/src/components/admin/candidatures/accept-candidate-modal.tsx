"use client"

import { useState } from "react"
import { ApplicationDto } from "@/lib/services/applications.service";
interface AcceptCandidateModalProps {
    applicant?: ApplicationDto | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AcceptCandidateModal({ applicant, isOpen, onClose }: AcceptCandidateModalProps) {
    if (!isOpen) return null;
    const [isDiscordChecked, setIsDiscordChecked] = useState(false);
    const [isPaymentTypeSelected, setIsPaymentTypeSelected] = useState(false);
    const [hideModal, setHideModal] = useState("");
    const closeModal = () => {
        setIsDiscordChecked(false);
        setIsPaymentTypeSelected(false);
        setHideModal("animate-out fade-out zoom-out duration-300");
        onClose();
    }
    return (
        <>
            {/* MODAL OVERLAY: Main Configuration */}
            <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay ${hideModal}`}>
                <div className="w-full max-w-xl bg-surface-container-low rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-outline-variant/15 overflow-hidden animate-in fade-in zoom-in duration-300">
                    {/* Modal Header */}
                    <div className="p-8 pb-4 flex justify-between items-start">
                        <div>
                            <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mb-1">Approuvé la candidature de <span className="text-primary">{applicant?.answers?.name}</span></h2>
                            <p className="text-outline text-xs uppercase tracking-[0.15em] font-medium"></p>
                        </div>
                        <button className="text-outline hover:text-on-surface transition-colors" onClick={closeModal}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {/* Modal Content */}
                    <div className="px-8 pb-10 space-y-8">

                        {/* Step 1: Payment */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10 text-primary border border-primary/20 font-headline font-bold text-sm">01</div>
                                <h3 className="text-on-surface font-semibold text-base">Type de paiement</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-container border-2 border-primary ring-2 ring-primary/20 transition-all text-center">
                                    <span className="material-symbols-outlined text-primary mb-2" >payments</span>
                                    <span className="text-xs font-bold text-on-surface tracking-tight">Paiement complet</span>
                                    <span className="text-[10px] text-outline mt-1">5,000.00 €</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-container border border-outline-variant/20 hover:border-outline/50 transition-all text-center">
                                    <span className="material-symbols-outlined text-outline mb-2">account_balance_wallet</span>
                                    <span className="text-xs font-bold text-outline tracking-tight">Plan de paiement</span>
                                    <span className="text-[10px] text-outline mt-1">4 x 1,350.00 €</span>
                                </button>
                            </div>
                        </section>
                        {/* Step 2: Discord */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10 text-primary border border-primary/20 font-headline font-bold text-sm">02</div>
                                <h3 className="text-on-surface font-semibold text-base">Accès Discord</h3>
                            </div>
                            <div className="bg-surface-container rounded-lg p-5 flex items-center justify-between border border-outline-variant/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                                        <span className="material-symbols-outlined">group_add</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-on-surface">Community Onboarding</p>
                                        <p className="text-[11px] text-outline">Sends private invitation to the Elite Terminal</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                                </label>
                            </div>
                        </section>
                        <div className="space-y-3 pt-2">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-1.5 ml-1">Recipient Channel</label>
                                <input
                                    className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim rounded px-4 py-3 text-sm text-on-surface outline-none transition-all"
                                    placeholder={applicant?.answers?.email}
                                    type="email"
                                    value={applicant?.answers?.email}
                                    onChange={() => isOpen}
                                />
                            </div>
                        </div>
                        {/* Footer Actions */}
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-primary-container text-on-primary-container py-4 rounded font-bold text-sm tracking-tight hover:opacity-90 transition-all shadow-[0_8px_20px_-6px_rgba(124,58,237,0.5)]">
                                Confirmer et envoyer
                            </button>
                            <button onClick={closeModal} className="px-8 bg-transparent text-outline hover:text-on-surface border border-outline-variant/20 hover:bg-surface-container transition-all py-4 rounded font-medium text-sm tracking-tight">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* PRESENTATION ONLY: SUCCESS STATE */}
            <div className="fixed bottom-12 right-12 z-[110] w-96 bg-surface-container rounded-xl border border-primary/30 shadow-2xl overflow-hidden etched-edge animate-in slide-in-from-right duration-500">
                <div className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl" >check_circle</span>
                    </div>
                    <div>
                        <h4 className="font-headline text-lg font-bold text-on-surface leading-tight">Invitation Sent Successfully</h4>
                        <p className="text-outline text-sm mt-1">Alexander Pierce has been added to the Discord queue and sent a Stripe checkout link.</p>
                        <div className="mt-4 flex gap-3">
                            <button className="text-xs font-bold text-primary hover:underline">View Transaction</button>
                            <button className="text-xs font-bold text-outline hover:text-on-surface">Dismiss</button>
                        </div>
                    </div>
                </div>
                <div className="h-1 bg-primary-container w-full"></div>
            </div>
            {/* PRESENTATION ONLY: ERROR STATE */}
            <div className="fixed bottom-12 left-12 z-[110] w-96 bg-surface-container rounded-xl border border-tertiary-container/30 shadow-2xl overflow-hidden etched-edge opacity-60">
                <div className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary-container/10 border border-tertiary-container/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-tertiary text-3xl" >warning</span>
                    </div>
                    <div>
                        <h4 className="font-headline text-lg font-bold text-on-surface leading-tight">Failed to send invitation</h4>
                        <p className="text-outline text-sm mt-1">Discord API returned a 403 Forbidden. Check bot permissions or candidate user ID.</p>
                        <div className="mt-4 flex gap-3">
                            <button className="text-xs font-bold text-tertiary hover:underline">Retry Operation</button>
                            <button className="text-xs font-bold text-outline hover:text-on-surface">System Logs</button>
                        </div>
                    </div>
                </div>
                <div className="h-1 bg-tertiary-container w-full"></div>
            </div>
        </>

    );
}