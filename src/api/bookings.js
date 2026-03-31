const BASE_URL = 'https://localhost:7046/api';

export async function getMyBookingsRequest() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/RoomBooking/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('A foglalások betöltése sikertelen.');
  return await response.json();
}

export async function getMyReservationsRequest() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/TableReservation/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('A foglalások betöltése sikertelen.');
  return await response.json();
}

export async function deleteBookingRequest(id) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/RoomBooking/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('A törlés sikertelen.');
}

export async function deleteReservationRequest(id) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/TableReservation/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('A törlés sikertelen.');
}
