import { useQuery } from '@tanstack/react-query';
import { getMyReservationsRequest } from '../api/bookings';

export function useMyReservations() {
  return useQuery({
    queryKey: ['myReservations'],
    queryFn: getMyReservationsRequest,
    enabled: !!localStorage.getItem('token'),
  });
}
