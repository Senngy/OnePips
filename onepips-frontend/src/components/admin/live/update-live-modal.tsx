"use client"

import { useState } from 'react'
import { useUpdateEvent } from '@/lib/hooks/events/useUpdateEvent';
import { EventDto } from '@/lib/services/events.service';
import { useToast } from '@/lib/hooks/useToast';
import { getUserFacingError } from '@/lib/services/users.service';

interface UpdateLiveModalProps {
    setIsOpen: (isOpen: boolean) => void;
    event: EventDto;
}

export default function UpdateLiveModal({ setIsOpen, event }: UpdateLiveModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>(event.startsAt.split('T')[0]);
    const [selectedTime, setSelectedTime] = useState<string>(event.startsAt.split('T')[1].substring(0, 5));
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description || '');

    const { mutateAsync: updateEvent, isPending: updatingEvent } = useUpdateEvent();
    const { error: toastError } = useToast();
    const combinedDate = new Date(`${selectedDate}T${selectedTime}:00Z`);

    const handleSubmitUpdateEvent = async () => {
        try {
            await updateEvent({
                id: event.id,
                data: {
                    title: title,
                    description: description,
                    startsAt: combinedDate.toISOString(),
                }
            });
            setIsOpen(false);
        } catch (error) {
            toastError({
                title: "Échec de la mise à jour",
                description: getUserFacingError(error),
            });
        }
    };

    return (
        /* Modal Overlay */
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay">
            <div className="w-full max-w-xl bg-[#1B1B1F] rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden relative glass-card">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                    <div>
                        <h2 className="font-headline font-bold text-2xl text-on-surface">Créer un nouveau Live</h2>
                        <p className="text-xs text-outline font-medium uppercase tracking-widest mt-1">Diffusion Elite Analyst</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-surface-variant rounded-full text-outline hover:text-on-surface transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">
                            Titre de la session
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="ex: Analyse Technique Hebdomadaire Gold/USD"
                            className="w-full bg-[#131317] border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline/30 text-on-surface"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez les points clés abordés..."
                            rows={3}
                            className="w-full bg-[#131317] border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline/30 resize-none text-on-surface"
                        />
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">
                                Date
                            </label>
                            <input
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                type="date"
                                className="w-full bg-[#131317] border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-on-surface [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">
                                Heure (UTC)
                            </label>
                            <input
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                type="time"
                                className="w-full bg-[#131317] border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-on-surface [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-surface-container/30 flex justify-end gap-4 border-t border-outline-variant/10">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        disabled={updatingEvent}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm text-outline hover:text-on-surface hover:bg-surface-variant transition-all disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitUpdateEvent}
                        disabled={updatingEvent}
                        className="bg-primary-container text-on-primary-container px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updatingEvent ? "Mise à jour..." : "Mettre à jour le Live"}
                    </button>
                </div>
            </div>
        </div>
    );
}