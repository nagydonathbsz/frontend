const BASE_URL = 'https://localhost:7046/api';

export async function loginRequest(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ UserId: email, Password: password }),
  });
  if (!response.ok) throw new Error('Sikertelen bejelentkezés! Ellenőrizze az adatait.');
  const token = await response.text();
  localStorage.setItem('token', token);
}

export async function logoutRequest() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetch(`${BASE_URL}/login/logout`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch {}
  }
  localStorage.removeItem('token');
}

export async function registerRequest(userData) {
  const response = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      isAdmin: 0,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Sikertelen regisztráció!');
  }
  return await response.json();
}
