const BASE_URL = 'https://localhost:7046/api';

export async function getRoomsByAccoRequest(accoId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/Room/acco/${accoId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('A szobák betöltése sikertelen.');
  return await response.json();
}

export async function postBookingRequest(data) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/RoomBooking`, {
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
