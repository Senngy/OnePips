"use client";

import { cn } from "@/lib/utils";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    variant?: "default" | "danger";
}

export default function ConfirmModal({
    open,
    title = "Confirmation",
    description = "Êtes-vous sûr de vouloir continuer ?",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    onConfirm,
    onCancel,
    loading = false,
    variant = "default",
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-xl bg-surface-container p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-2">{title}</h2>

                <p className="text-sm text-outline mb-6">{description}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-surface-variant text-on-surface text-sm"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-bold",
                            variant === "danger"
                                ? "bg-red-500 text-white"
                                : "bg-primary-container text-on-primary-container"
                        )}
                    >
                        {loading ? "..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}