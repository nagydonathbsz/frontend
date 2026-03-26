import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutRequest } from '../api/auth';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => queryClient.setQueryData(['currentUser'], null),
  });
}
