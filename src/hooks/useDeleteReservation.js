import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReservationRequest } from '../api/bookings';

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteReservationRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myReservations'] }),
  });
}
