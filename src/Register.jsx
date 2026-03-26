import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from './hooks/useRegister';

function Register() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isEmailValid = formData.email.includes('@') && formData.email.includes('.');
  const isPasswordValid = formData.password.length >= 6;
  const isNameValid = formData.name.trim().length >= 3;
  const isConfirmValid = formData.confirmPassword === formData.password;
  const isFormValid = isEmailValid && isPasswordValid && isNameValid && isConfirmValid && !isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    register(formData, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      },
      onError: (err) => setError(err.message || 'Hiba történt a regisztráció során.'),
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Regisztráció</h1>
        <p className="login-subtitle">Hozzon létre fiókot az utazás megkezdéséhez.</p>

        {success ? (
          <div style={{ textAlign: 'center', color: 'var(--success)', padding: '20px' }}>
            <h3>Sikeres regisztráció!</h3>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Jelszó megerősítése</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {formData.confirmPassword && !isConfirmValid && (
                <p className="field-error">A jelszavak nem egyeznek.</p>
              )}
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={!isFormValid}
              style={{ opacity: isFormValid ? 1 : 0.6, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
            >
              {isPending ? 'Feldolgozás...' : 'Regisztráció'}
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
