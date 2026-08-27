import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommunityStats, updateCommunityStat } from "@/lib/services/community.service";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

export function useCommunityStats() {
    const { loading: permissionsLoading, hasPermission } = usePermissions();

    return useQuery({
        queryKey: ["community-stats"],
        queryFn: getCommunityStats,
        enabled: !permissionsLoading && hasPermission("COMMUNITY_READ"),
    });
}

export function useUpdateCommunityStat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateCommunityStat(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["community-stats"] });
        },
    });
}
