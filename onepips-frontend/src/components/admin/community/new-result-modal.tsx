"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import { useCreateResult } from "@/lib/hooks/community/useResults";
import { useToast } from "@/lib/hooks/useToast";
import { uploadImage } from "@/lib/services/upload.service";
import ImageLightbox from "@/components/ui/image-lightbox";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

interface NewResultModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FOREX_PAIRS = [
    "XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "USDCHF",
    "AUDUSD", "USDCAD", "NZDUSD", "GBPJPY", "EURJPY",
];

export default function NewResultModal({ isOpen, onClose }: NewResultModalProps) {
    const { mutate: createResult, isPending } = useCreateResult();
    const { success: toastSuccess, error: toastError } = useToast();

    const [exitAnim, setExitAnim] = useState("");
    const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const [imageMode, setImageMode] = useState<"url" | "file">("url");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [resultForm, setResultForm] = useState({
        title: "",
        image: "",
        gain: "" as string | number,
        pair: "XAUUSD",
        description: "",
        date: new Date(),
        isVisible: true,
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const closeModal = () => {
        setExitAnim("animate-out fade-out zoom-out duration-300");
        closeTimerRef.current = setTimeout(() => {
            setExitAnim("");
            setResultForm({
                title: "",
                image: "",
                gain: "",
                pair: "XAUUSD",
                description: "",
                date: new Date(),
                isVisible: true,
            });
            onClose();
        }, 280);
    };

    const isBusy = isPending || uploading;

    const handleFile = async (file: File) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            toastError({ title: "Format invalide", description: "Seuls les formats JPG, PNG, WebP et GIF sont acceptés." });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toastError({ title: "Fichier trop lourd", description: "La taille maximale est de 5 Mo." });
            return;
        }
        // Optimistic preview via object URL
        const preview = URL.createObjectURL(file);
        setResultForm(prev => ({ ...prev, image: preview }));
        setUploading(true);
        try {
            const url = await uploadImage(file);
            console.log("[UPLOAD SUCCESS] backend returned:", url);
            setResultForm(prev => ({ ...prev, image: url }));
            toastSuccess({
                title: "Upload réussi",
                description: "L'image a été chargée avec succès.",
            });
        } catch (err: unknown) {
            setResultForm(prev => ({ ...prev, image: "" }));
            toastError({
                title: "Échec de l'upload",
                description: err instanceof Error ? err.message : "Erreur inconnue.",
            });
        } finally {
            URL.revokeObjectURL(preview);
            setUploading(false);
        }
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const gainVal = parseFloat(String(resultForm.gain));
        if (isNaN(gainVal)) {
            toastError({ title: "Valeur invalide", description: "Le gain doit être un nombre valide." });
            return;
        }

        createResult(
            {
                title: resultForm.title,
                image: resultForm.image,
                gain: gainVal,
                pair: resultForm.pair,
                description: resultForm.description || undefined,
                date: resultForm.date.toISOString(),
                isVisible: resultForm.isVisible,
            },
            {
                onSuccess: () => {
                    toastSuccess({
                        title: "Résultat publié !",
                        description: `${resultForm.title} (${resultForm.pair} +${gainVal}%) a été ajouté à la communauté.`,
                        duration: 6000,
                    });
                    setTimeout(closeModal, 400);
                },
                onError: (err) => {
                    toastError({
                        title: "Échec de la publication",
                        description: err.message ?? "Une erreur est survenue. Réessayez.",
                    });
                },
            }
        );
    };

    return (
        <>
            {/* ── Overlay ── */}
            <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay ${exitAnim}`}>
                <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface-container-low rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.85)] border border-outline-variant/15 animate-in fade-in zoom-in duration-300">

                    {/* ── Header ── */}
                    <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                                </div>
                                <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
                                    Nouveau Résultat
                                </h2>
                            </div>
                            <p className="text-outline text-xs uppercase tracking-[0.15em] font-medium pl-10">
                                Publier une performance de trading
                            </p>
                        </div>
                        <button
                            onClick={closeModal}
                            disabled={isPending}
                            className="text-outline hover:text-on-surface transition-colors mt-1 disabled:opacity-40"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* ── Form ── */}

                    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">

                        {/* Step 01 – Trade Info */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10 text-primary border border-primary/20 font-headline font-bold text-sm shrink-0">01</div>
                                <h3 className="text-on-surface font-semibold text-sm">Informations du trade</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Pair */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Paire</label>
                                    <select
                                        required
                                        disabled={isPending}
                                        value={resultForm.pair || ""}
                                        onChange={e => setResultForm({ ...resultForm, pair: e.target.value })}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-sm text-on-surface outline-none transition-all disabled:opacity-50"
                                    >
                                        {FOREX_PAIRS.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Gain */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Gain (%)</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            disabled={isPending}
                                            value={resultForm.gain || ""}
                                            onChange={e => setResultForm({ ...resultForm, gain: e.target.value })}
                                            placeholder="ex: 4.75"
                                            className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-4 pr-10 py-3 text-sm text-on-surface outline-none transition-all disabled:opacity-50 placeholder:text-outline/30"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline text-sm font-bold">%</span>
                                    </div>
                                </div>
                                {/* Date */}
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Date</label>
                                    <DatePicker
                                        selected={resultForm.date}
                                        onChange={(date: Date | null) => date && setResultForm({ ...resultForm, date })}
                                        dateFormat="dd/MM/yyyy"
                                        locale="fr"
                                        disabled={isPending}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-sm text-on-surface outline-none transition-all disabled:opacity-50"
                                        wrapperClassName="w-full"
                                    />
                                </div>
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Titre</label>
                                    <input
                                        required
                                        type="text"
                                        disabled={isPending}
                                        value={resultForm.title || ""}
                                        onChange={e => setResultForm({ ...resultForm, title: e.target.value })}
                                        placeholder="ex: Breakout XAUUSD"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-sm text-on-surface outline-none transition-all disabled:opacity-50 placeholder:text-outline/30"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Step 02 – Image & Description */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10 text-primary border border-primary/20 font-headline font-bold text-sm shrink-0">02</div>
                                <h3 className="text-on-surface font-semibold text-sm">Visuel & Analyse</h3>
                            </div>

                            {/* Image — tabbed URL / File picker */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-label uppercase tracking-widest text-outline">Image</label>
                                    {/* Mode toggle */}
                                    <div className="flex rounded-md overflow-hidden border border-outline-variant/15 text-[10px] font-label uppercase tracking-widest">
                                        <button type="button" onClick={() => setImageMode("url")}
                                            className={`px-3 py-1 transition-colors ${imageMode === "url" ? "bg-primary text-on-primary" : "text-outline hover:text-on-surface"}`}>
                                            URL
                                        </button>
                                        <button type="button" onClick={() => setImageMode("file")}
                                            className={`px-3 py-1 transition-colors ${imageMode === "file" ? "bg-primary text-on-primary" : "text-outline hover:text-on-surface"}`}>
                                            Fichier
                                        </button>
                                    </div>
                                </div>

                                {imageMode === "url" ? (
                                    <div className="flex gap-3">
                                        <input
                                            required={!resultForm.image}
                                            type="url"
                                            disabled={isBusy}
                                            value={resultForm.image || ""}
                                            onChange={e => setResultForm({ ...resultForm, image: e.target.value })}
                                            placeholder="https://…"
                                            className="flex-1 bg-surface-container-lowest border border-outline-variant/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-sm text-on-surface outline-none transition-all disabled:opacity-50 placeholder:text-outline/30"
                                        />
                                        {resultForm.image && (
                                            <div
                                                className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant/20 shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity"
                                                onClick={() => setLightboxSrc(resultForm.image)}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={resultForm.image} alt="preview"
                                                    className="w-full h-full object-cover"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* ── Drag & Drop zone ── */
                                    <div
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={e => {
                                            e.preventDefault();
                                            setDragOver(false);
                                            const file = e.dataTransfer.files[0];
                                            if (file) handleFile(file);
                                        }}
                                        onClick={() => !isBusy && fileInputRef.current?.click()}
                                        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all cursor-pointer py-6 px-4
                                            ${dragOver ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container"}
                                            ${isBusy ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                                        />

                                        {uploading ? (
                                            <>
                                                <svg className="animate-spin h-7 w-7 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z" />
                                                </svg>
                                                <span className="text-xs text-outline">Upload en cours…</span>
                                            </>
                                        ) : resultForm.image ? (
                                            /* Uploaded preview */
                                            <>
                                                <div
                                                    className="w-24 h-16 rounded-lg overflow-hidden border border-outline-variant/20 cursor-zoom-in hover:opacity-80 transition-opacity"
                                                    onClick={(e) => { e.stopPropagation(); setLightboxSrc(resultForm.image); }}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={resultForm.image} alt="preview" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex items-center gap-2 text-primary">
                                                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                    <span className="text-xs font-medium">Image chargée</span>
                                                </div>
                                                <button type="button" onClick={e => { e.stopPropagation(); setResultForm(prev => ({ ...prev, image: "" })); }}
                                                    className="text-[10px] text-outline hover:text-error transition-colors">
                                                    Supprimer
                                                </button>
                                            </>
                                        ) : (
                                            /* Default empty state */
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary">add_a_photo</span>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-on-surface">Glisser-déposer ou cliquer</p>
                                                    <p className="text-[10px] text-outline mt-0.5">JPG, PNG, WebP · max 5 Mo</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-label uppercase tracking-widest text-outline">Description / Analyse <span className="text-outline/50 normal-case">(optionnel)</span></label>
                                <textarea
                                    disabled={isPending}
                                    value={resultForm.description || ""}
                                    onChange={e => setResultForm({ ...resultForm, description: e.target.value })}
                                    placeholder="Setup: Breakout sur résistance H4, RR 1:3…"
                                    rows={3}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 text-sm text-on-surface outline-none transition-all disabled:opacity-50 placeholder:text-outline/30 resize-none"
                                />
                            </div>
                        </section>

                        {/* Step 03 – Visibility toggle */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10 text-primary border border-primary/20 font-headline font-bold text-sm shrink-0">03</div>
                                <h3 className="text-on-surface font-semibold text-sm">Visibilité</h3>
                            </div>
                            <div className="bg-surface-container rounded-xl p-4 flex items-center justify-between border border-outline-variant/5">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${resultForm.isVisible ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-outline"}`}>
                                        <span className="material-symbols-outlined text-base">{resultForm.isVisible ? "visibility" : "visibility_off"}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-on-surface">Publié sur le site</p>
                                        <p className="text-[11px] text-outline">
                                            {resultForm.isVisible ? "Visible par les visiteurs dès la publication" : "Masqué — visible uniquement en admin"}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={resultForm.isVisible}
                                        onChange={e => setResultForm({ ...resultForm, isVisible: e.target.checked })}
                                        disabled={isPending}
                                    />
                                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
                                </label>
                            </div>
                        </section>

                        {/* ── Footer ── */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-3.5 rounded-xl font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z" />
                                        </svg>
                                        PUBLICATION…
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">cloud_upload</span>
                                        PUBLIER LE RÉSULTAT
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isPending}
                                className="px-6 bg-transparent text-outline hover:text-on-surface border border-outline-variant/20 hover:bg-surface-container transition-all py-3.5 rounded-xl font-medium text-sm tracking-tight disabled:opacity-40"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        </>
    );
}