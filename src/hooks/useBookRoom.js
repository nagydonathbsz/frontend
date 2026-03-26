import { useMutation } from '@tanstack/react-query';
import { postBookingRequest } from '../api/rooms';

export function useBookRoom() {
  return useMutation({ mutationFn: postBookingRequest });
}
