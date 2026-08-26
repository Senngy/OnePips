import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, updateApplicationStatus } from "@/lib/services/applications.service";
import { usePermissions } from "@/lib/hooks/permissions/usePermissions";

export const useApplicants = () => {
    const { loading: permissionsLoading, hasPermission } = usePermissions();

    const query = useQuery({
        queryKey: ["applicants"],
        queryFn: getApplications,
        enabled: !permissionsLoading && hasPermission("APPLICATIONS_READ"),
    });

    return {
        applicants: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
    };
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateApplicationStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applicants"] });
        },
    });
};
