import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getResults, createResult, updateResult, deleteResult } from "@/lib/services/community.service";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

export function useResults() {
    const { loading: permissionsLoading, hasPermission } = usePermissions();

    return useQuery({
        queryKey: ["results"],
        queryFn: getResults,
        enabled: !permissionsLoading && hasPermission("COMMUNITY_READ"),
    });
}

export function useCreateResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        },
    });
}

export function useUpdateResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateResult(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        },
    });
}

export function useDeleteResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        },
    });
}
