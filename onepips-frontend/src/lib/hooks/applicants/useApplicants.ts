import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, updateApplicationStatus } from "@/lib/services/applications.service";

export const useApplicants = () => {
    const query = useQuery({
        queryKey: ["applicants"],
        queryFn: getApplications,
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
