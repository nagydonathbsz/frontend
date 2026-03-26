import React, { useState } from 'react';
import callApi from './call_api';
import { Link } from 'react-router-dom';

function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setError('');

    try {
      const token = await callApi.login(formData.email, formData.password);
      if (token) {
        onLoginSuccess(); 
      }
    } catch (err) {
      setError(err.message || 'Hibás email cím vagy jelszó!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bejelentkezés</h1>
        <p className="login-subtitle">Üdvözöljük újra! Kérjük, lépjen be a fiókjába.</p>

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="password">Jelszó</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <div className="login-footer">
          <p>Még nincs fiókja?</p>
          {/* Gomb helyett Link-et használunk, ami a /register útvonalra visz */}
          <Link to="/register" className="switch-btn">
            Regisztráció létrehozása
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;