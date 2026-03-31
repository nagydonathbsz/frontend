import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBookingRequest } from '../api/bookings';

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBookingRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myBookings'] }),
  });
}
