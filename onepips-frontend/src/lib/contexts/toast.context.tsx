"use client";

import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface Toast {
    id: string;
    variant: ToastVariant;
    title: string;
    description?: string;
    actions?: ToastAction[];
    duration?: number; // ms — 0 = persist until dismissed
}

interface ToastContextValue {
    toasts: Toast[];
    toast: (opts: Omit<Toast, "id">) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToastContext must be used inside <ToastProvider>");
    return ctx;
}

// ── Config per variant ─────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
    ToastVariant,
    { icon: string; borderColor: string; iconColor: string; iconBg: string; bar: string }
> = {
    success: {
        icon: "check_circle",
        borderColor: "border-primary/30",
        iconColor: "text-primary",
        iconBg: "bg-primary/10 border-primary/20",
        bar: "bg-primary-container",
    },
    error: {
        icon: "error",
        borderColor: "border-error/30",
        iconColor: "text-error",
        iconBg: "bg-error/10 border-error/20",
        bar: "bg-error",
    },
    warning: {
        icon: "warning",
        borderColor: "border-tertiary-container/30",
        iconColor: "text-tertiary",
        iconBg: "bg-tertiary-container/10 border-tertiary-container/20",
        bar: "bg-tertiary-container",
    },
    info: {
        icon: "info",
        borderColor: "border-secondary/30",
        iconColor: "text-secondary",
        iconBg: "bg-secondary/10 border-secondary/20",
        bar: "bg-secondary-container",
    },
};

// ── Single Toast Card ──────────────────────────────────────────────────────

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const cfg = VARIANT_CONFIG[toast.variant];
    const [exiting, setExiting] = useState(false);

    const handleDismiss = useCallback(() => {
        setExiting(true);
        setTimeout(onDismiss, 350);
    }, [onDismiss]);

    console.log("[FRONT ToastCard] Rendering toast:", toast, "| exiting:", exiting);

    return (
        <div
            className={`w-96 bg-surface-container rounded-xl border ${cfg.borderColor} shadow-2xl overflow-hidden etched-edge transition-all
                ${exiting
                    ? "animate-out slide-out-to-right fade-out duration-350 opacity-0"
                    : "animate-in slide-in-from-right fade-in duration-500"
                }`}
        >
            <div className="p-6 flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${cfg.iconBg} border flex items-center justify-center`}>
                    <span
                        className={`material-symbols-outlined ${cfg.iconColor} text-3xl`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        {cfg.icon}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-headline text-base font-bold text-on-surface leading-tight">
                        {toast.title}
                    </h4>
                    {toast.description && (
                        <p className="text-outline text-sm mt-1 leading-relaxed">
                            {toast.description}
                        </p>
                    )}
                    {/* Actions */}
                    {(toast.actions && toast.actions.length > 0) && (
                        <div className="mt-4 flex gap-3">
                            {toast.actions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => { action.onClick(); handleDismiss(); }}
                                    className={`text-xs font-bold hover:underline ${i === 0 ? cfg.iconColor : "text-outline hover:text-on-surface"}`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {/* Dismiss link if no actions */}
                    {(!toast.actions || toast.actions.length === 0) && (
                        <div className="mt-3">
                            <button
                                onClick={handleDismiss}
                                className="text-xs font-bold text-outline hover:text-on-surface"
                            >
                                Fermer
                            </button>
                        </div>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="text-outline hover:text-on-surface transition-colors shrink-0 -mt-1 -mr-1"
                >
                    <span className="material-symbols-outlined text-base">close</span>
                </button>
            </div>

            {/* Progress bar */}
            <div className={`h-1 ${cfg.bar} w-full`} />
        </div>
    );
}

// ── Provider ───────────────────────────────────────────────────────────────

const DEFAULT_DURATION = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        timers.current.forEach(t => clearTimeout(t));
        timers.current.clear();
        setToasts([]);
    }, []);

    const toast = useCallback((opts: Omit<Toast, "id">): string => {
        const id = Math.random().toString(36).slice(2);
        const duration = opts.duration ?? DEFAULT_DURATION;

        setToasts(prev => [...prev, { ...opts, id }]);

        if (duration > 0) {
            const timer = setTimeout(() => dismiss(id), duration);
            timers.current.set(id, timer);
        }

        return id;
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
            {children}

            {/* ── Toast Viewport ── */}
            {toasts.length > 0 && (
                <div
                    className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 items-end pointer-events-none"
                    aria-live="polite"
                    aria-label="Notifications"
                >
                    {toasts.map(t => (
                        <div key={t.id} className="pointer-events-auto">
                            <ToastCard
                                toast={t}
                                onDismiss={() => dismiss(t.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
}
