"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserStatus,
  type UserStatus,
} from "@/lib/services/users.service";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: UserStatus;
    }) => updateUserStatus(userId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-permissions"],
      });
    },
  });
}