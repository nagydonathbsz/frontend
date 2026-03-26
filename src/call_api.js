const BASE_URL = 'https://localhost:7046/api'; 

const callApi = {
    login: async (email, password) => {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId: email, Password: password }),
        });

        if (!response.ok) throw new Error('Sikertelen bejelentkezés! Ellenőrizze az adatait.');
        
        const token = await response.text();
        localStorage.setItem('token', token);
        return token;
    },

    getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Nincs érvényes munkamenet (token hiányzik)!');

        const response = await fetch(`${BASE_URL}/user/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Nincs jogosultsága a profil megtekintéséhez.');
        return await response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${BASE_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                isAdmin: 0 
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Sikertelen regisztráció!');
        }

        return await response.json();
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch(`${BASE_URL}/login/logout`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
            } catch (err) {
                console.warn("A szerveroldali kijelentkezés nem sikerült, de a lokális tokent töröljük.");
            }
        }
        localStorage.removeItem('token');
    }
};

export default callApi;