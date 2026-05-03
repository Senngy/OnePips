import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelEvent } from "@/lib/services/events.service";

export const useCancelEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) => cancelEvent(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};