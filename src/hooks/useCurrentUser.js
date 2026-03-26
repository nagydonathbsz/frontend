import { useQuery } from '@tanstack/react-query';
import { getMeRequest } from '../api/user';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getMeRequest,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
