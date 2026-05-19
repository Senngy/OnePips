import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/services/community.service";

export function useTestimonials() {
    return useQuery({
        queryKey: ["testimonials"],
        queryFn: getTestimonials,
    });
}

export function useCreateTestimonial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTestimonial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}

export function useUpdateTestimonial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateTestimonial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}

export function useDeleteTestimonial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTestimonial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}
