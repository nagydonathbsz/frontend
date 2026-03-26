import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeRequest } from '../api/user';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMeRequest,
    onSuccess: (updatedUser) => queryClient.setQueryData(['currentUser'], updatedUser),
  });
}
