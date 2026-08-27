import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, GetLeadsParams, updateLead, updateLeadStatus, deleteLead, deleteBulkLeads } from "@/lib/services/leads.service";
import { usePermissions } from "../permissions/usePermissions";


export function useLeads(params: GetLeadsParams = {}) {
    const {
        page = 1,
        limit = 10,
    } = params;

    const {
        loading: permissionsLoading,
        hasPermission,
    } = usePermissions();

    const canReadLeads = hasPermission("LEADS_READ");

    const leadsQuery = useQuery({
        queryKey: ["leads", page, limit],
        queryFn: () => getLeads({ page, limit }),
        enabled: !permissionsLoading && canReadLeads,
        retry: false,
    });

    return {
        leads: leadsQuery.data?.leads ?? [],
        isLoading: leadsQuery.isLoading,
        error: leadsQuery.error,
        total: leadsQuery.data?.total ?? 0,
        page: leadsQuery.data?.page ?? 1,
        lastPage: leadsQuery.data?.lastPage ?? 1,
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
