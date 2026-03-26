import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '../api/auth';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }) => loginRequest(email, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
  });
}
