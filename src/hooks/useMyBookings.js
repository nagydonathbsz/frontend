import { useQuery } from '@tanstack/react-query';
import { getMyBookingsRequest } from '../api/bookings';

export function useMyBookings() {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: getMyBookingsRequest,
    enabled: !!localStorage.getItem('token'),
  });
}
