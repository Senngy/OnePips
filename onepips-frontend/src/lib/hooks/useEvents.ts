import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../services/events.service";

export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: getEvents,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}