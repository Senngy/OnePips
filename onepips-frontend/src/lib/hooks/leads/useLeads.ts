import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, GetLeadsParams, updateLead, updateLeadStatus, deleteLead, deleteBulkLeads } from "@/lib/services/leads.service";

export function useLeads(params: GetLeadsParams = {}) {
    const query = useQuery({
        queryKey: ["leads", params],
        queryFn: () => getLeads(params),
    });

    return {
        leads: query.data?.leads ?? [],
        isLoading: query.isLoading,
        error: query.error,
        total: query.data?.total ?? 0,
        page: query.data?.page ?? 1,
        lastPage: query.data?.lastPage ?? 1,
    };
}

export function useUpdateLeadStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateLeadStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });
}

export function useUpdateLead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateLead(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });
}

export function useDeleteLead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });
}

export function useDeleteBulkLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => deleteBulkLeads(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });
}
