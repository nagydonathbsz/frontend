import { useMutation } from '@tanstack/react-query';
import { postTableReservationRequest } from '../api/restaurantTables';

export function useReserveTable() {
  return useMutation({ mutationFn: postTableReservationRequest });
}
