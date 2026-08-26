import { useQuery } from "@tanstack/react-query";
import { getUpcomingEvents } from "@/lib/services/events.service";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

export function useUpcomingEvents() {
    const { loading: permissionsLoading, hasPermission } = usePermissions();

    return useQuery({
        queryKey: ["upcoming-events"],
        queryFn: getUpcomingEvents,
        enabled: !permissionsLoading && hasPermission("EVENTS_READ"),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

