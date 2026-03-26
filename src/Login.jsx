import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from './hooks/useLogin';

function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => navigate('/citys'),
        onError: (err) => setError(err.message || 'Hibás email cím vagy jelszó!'),
      }
    );
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

          <button type="submit" className="login-btn" disabled={isPending}>
            {isPending ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <div className="login-footer">
          <p>Még nincs fiókja?</p>
          <Link to="/register" className="switch-btn">
            Regisztráció létrehozása
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
