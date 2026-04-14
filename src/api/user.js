const BASE_URL = 'https://localhost:7046/api';

export async function getMeRequest() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Nincs érvényes munkamenet (token hiányzik)!');
  const response = await fetch(`${BASE_URL}/user/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Nincs jogosultsága a profil megtekintéséhez.');
  return await response.json();
}

export async function deleteAccountRequest() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Nincs érvényes munkamenet!');
  const response = await fetch(`${BASE_URL}/user/me`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('A fiók törlése sikertelen!');
}

export async function updateMeRequest(userData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Nincs érvényes munkamenet!');
  const response = await fetch(`${BASE_URL}/user/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: '',
      isAdmin: userData.isAdmin ?? 0,
    }),
  });
  if (!response.ok) throw new Error('A profil frissítése sikertelen!');
  return await response.json();
}
