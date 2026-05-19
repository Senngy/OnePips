import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommunityStats, updateCommunityStat } from "@/lib/services/community.service";

export function useCommunityStats() {
    return useQuery({
        queryKey: ["community-stats"],
        queryFn: getCommunityStats,
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
