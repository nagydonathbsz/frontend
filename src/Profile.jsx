import React, { useState } from 'react';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useUpdateProfile } from './hooks/useUpdateProfile';

function Profile() {
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const startEdit = () => {
    setFormData({ name: user.name, email: user.email, phone: user.phone || '' });
    setSuccess(false);
    setError('');
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(
      { ...formData, isAdmin: user.isAdmin },
      {
        onSuccess: () => {
          setEditing(false);
          setSuccess(true);
        },
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <div className="login-container">
      <div className="login-card profile-card">
        <div className="profile-header">
          <h1 className="login-title">Profilom</h1>
          {user?.isAdmin === 1 && <span className="profile-admin-badge">Admin</span>}
        </div>

        {success && (
          <div className="profile-success-msg">Adatok sikeresen frissítve!</div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Teljes név</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
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
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefonszám</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+36 30 123 4567"
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="profile-actions">
              <button type="submit" className="login-btn" disabled={isPending}>
                {isPending ? 'Mentés...' : 'Mentés'}
              </button>
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => setEditing(false)}
                disabled={isPending}
              >
                Mégse
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-fields">
              <div className="profile-field">
                <span className="profile-field-label">Teljes név</span>
                <span className="profile-field-value">{user?.name}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Email cím</span>
                <span className="profile-field-value">{user?.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Telefonszám</span>
                <span className="profile-field-value">
                  {user?.phone || <em className="profile-empty">Nincs megadva</em>}
                </span>
              </div>
            </div>

            <button className="login-btn" onClick={startEdit}>
              Adatok szerkesztése
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
