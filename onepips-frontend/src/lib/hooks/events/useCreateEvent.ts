import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/lib/services/events.service";

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            // refresh la liste des events automatiquement
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}
