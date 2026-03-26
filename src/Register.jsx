import React, { useState } from 'react';
import callApi from './call_api';
import { Link } from 'react-router-dom';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validáció
  const isEmailValid = formData.email.includes('@') && formData.email.includes('.');
  const isPasswordValid = formData.password.length >= 6;
  const isNameValid = formData.name.trim().length >= 3;
  const isFormValid = isEmailValid && isPasswordValid && isNameValid && !loading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      await callApi.register(formData);
      setSuccess(true);
      
      // 2 másodperc múlva átirányítjuk a loginra
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Hiba történt a regisztráció során.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Regisztráció</h1>
        <p className="login-subtitle">Hozzon létre fiókot az utazás megkezdéséhez.</p>

        {success ? (
          <div style={{ textAlign: 'center', color: 'green', padding: '20px' }}>
            <h3>Sikeres regisztráció! ✅</h3>
            <p>Átirányítás a bejelentkezéshez...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Teljes név</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Pl. Kovács János"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email cím</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="pelda@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefonszám (opcionális)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+36 30 123 4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Jelszó</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="min. 6 karakter"
                required
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button 
              type="submit" 
              className="login-btn"
              disabled={!isFormValid}
              style={{ opacity: isFormValid ? 1 : 0.6, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
            >
              {loading ? 'Feldolgozás...' : 'Regisztráció'}
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>Már van fiókja?</p>
          <Link to="/login" className="switch-btn">
            Vissza a belépéshez
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;