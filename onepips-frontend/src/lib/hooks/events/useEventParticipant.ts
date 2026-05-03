import { useQuery } from "@tanstack/react-query";
import { getEventParticipants } from "@/lib/services/events.service";

export const useEventParticipants = (eventId?: string) => {
    return useQuery({
        queryKey: ["event-participants", eventId],
        queryFn: () => getEventParticipants(eventId!),
        enabled: !!eventId,
    });
};