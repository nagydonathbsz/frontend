const BASE_URL = 'https://localhost:7046/api';

export async function getTablesByRestaurantRequest(restaurantId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/RestaurantTable/restaurant/${restaurantId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Az asztalok betöltése sikertelen.');
  return await response.json();
}

export async function postTableReservationRequest(data) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/TableReservation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'A foglalás sikertelen.');
  }
  return await response.json();
}
