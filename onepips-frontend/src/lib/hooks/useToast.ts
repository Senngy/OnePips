import { useToastContext, type ToastVariant, type ToastAction } from "@/lib/contexts/toast.context";

interface ToastOptions {
    title: string;
    description?: string;
    actions?: ToastAction[];
    /** Duration in ms. 0 = persist. Default: 5000 */
    duration?: number;
}

/**
 * Hook to trigger toasts from anywhere in the admin.
 *
 * @example
 * const { success, error } = useToast();
 * success({ title: "Saved!", description: "Your changes have been saved." });
 * error({ title: "Failed", description: err.message });
 */
export function useToast() {
    const { toast, dismiss, dismissAll } = useToastContext();

    const fire = (variant: ToastVariant) => (opts: ToastOptions) =>
        toast({ variant, ...opts });

    return {
        toast,
        dismiss,
        dismissAll,
        success: fire("success"),
        error: fire("error"),
        warning: fire("warning"),
        info: fire("info"),
    };
}
