import { useQuery } from "@tanstack/react-query";
import { getArchivedEvents } from "@/lib/services/events.service";

export function useArchivedEvents() {
    return useQuery({
        queryKey: ["archived-events"],
        queryFn: getArchivedEvents,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}
