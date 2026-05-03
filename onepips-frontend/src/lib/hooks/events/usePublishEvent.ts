import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishEvent } from "@/lib/services/events.service";

export const usePublishEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) => publishEvent(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};