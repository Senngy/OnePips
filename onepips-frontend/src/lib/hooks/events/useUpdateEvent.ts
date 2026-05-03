import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "@/lib/services/events.service";

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updateEvent(id, data),

        onSuccess: () => {
            // refresh liste events
            queryClient.invalidateQueries({ queryKey: ["events"] });

            // refresh état live (important pour countdown)
            queryClient.invalidateQueries({ queryKey: ["event-state"] });
        },
    });
}