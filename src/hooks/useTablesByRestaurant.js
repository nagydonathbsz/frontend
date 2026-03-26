import { useQuery } from '@tanstack/react-query';
import { getTablesByRestaurantRequest } from '../api/restaurantTables';

export function useTablesByRestaurant(restaurantId) {
  return useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => getTablesByRestaurantRequest(restaurantId),
    enabled: !!restaurantId,
  });
}
