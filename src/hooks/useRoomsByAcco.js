import { useQuery } from '@tanstack/react-query';
import { getRoomsByAccoRequest } from '../api/rooms';

export function useRoomsByAcco(accoId) {
  return useQuery({
    queryKey: ['rooms', accoId],
    queryFn: () => getRoomsByAccoRequest(accoId),
    enabled: !!accoId,
  });
}
