import { useQuery } from "@tanstack/react-query";
import { getArchivedEvents } from "@/lib/services/events.service";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

export function useArchivedEvents() {
    const { loading: permissionsLoading, hasPermission } = usePermissions();

    return useQuery({
        queryKey: ["archived-events"],
        queryFn: getArchivedEvents,
        enabled: !permissionsLoading && hasPermission("EVENTS_READ"),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}
