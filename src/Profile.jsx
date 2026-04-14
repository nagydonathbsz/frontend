import React, { useState } from 'react';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useUpdateProfile } from './hooks/useUpdateProfile';
import { useMyBookings } from './hooks/useMyBookings';
import { useMyReservations } from './hooks/useMyReservations';
import { useDeleteBooking } from './hooks/useDeleteBooking';
import { useDeleteReservation } from './hooks/useDeleteReservation';
import { deleteAccountRequest } from './api/user';

function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  const cls = s === 'free' ? 'free' : s === 'booked' ? 'booked' : 'default';
  const label = s === 'free' ? 'Szabad' : s === 'booked' ? 'Foglalt' : (status ?? 'Ismeretlen');
  return <span className={`booking-status ${cls}`}>{label}</span>;
}

function formatDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('hu-HU');
}

function formatTime(val) {
  if (!val) return '';
  return new Date(val).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
}

function Profile() {
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings();
  const { data: reservations, isLoading: reservationsLoading } = useMyReservations();
  const { mutate: deleteBooking } = useDeleteBooking();
  const { mutate: deleteReservation } = useDeleteReservation();

  const [activeTab, setActiveTab] = useState('info');
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
        onSuccess: () => { setEditing(false); setSuccess(true); },
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <div className="profile-page">
      <div className="tab-menu">
        <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
          Adataim
        </button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
          Szállásfoglalásaim
        </button>
        <button className={activeTab === 'reservations' ? 'active' : ''} onClick={() => setActiveTab('reservations')}>
          Asztalfoglalásaim
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="login-card profile-card">
          <div className="profile-header">
            <h1 className="login-title">Profilom</h1>
            {user?.isAdmin === 1 && <span className="profile-admin-badge">Admin</span>}
          </div>

          {success && <div className="profile-success-msg">Adatok sikeresen frissítve!</div>}

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Teljes név</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required minLength={3} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email cím</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefonszám</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+36 30 123 4567" />
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="profile-actions">
                <button type="submit" className="login-btn" disabled={isPending}>
                  {isPending ? 'Mentés...' : 'Mentés'}
                </button>
                <button type="button" className="profile-cancel-btn" onClick={() => setEditing(false)} disabled={isPending}>
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
              <button className="login-btn" onClick={startEdit}>Adatok szerkesztése</button>
              <button
                className="booking-delete-btn"
                style={{ marginTop: '12px', width: '100%' }}
                onClick={async () => {
                  if (!window.confirm('Biztosan törlöd a fiókodat? Ez az összes foglalásodat is törli, és nem vonható vissza!')) return;
                  await deleteAccountRequest();
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
              >Fiók törlése</button>
            </>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-list">
          {bookingsLoading ? (
            <p>Betöltés...</p>
          ) : bookings?.length > 0 ? (
            bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-card-info">
                  <h4>🛏️ {b.room?.capacity ? `${b.room.capacity} személyes szoba` : `Szoba #${b.roomId}`}</h4>
                  {b.room?.accommodation && (
                    <p>🏨 {b.room.accommodation.name}{b.room.accommodation.city ? ` · ${b.room.accommodation.city.name}` : ''}</p>
                  )}
                  <p>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</p>
                </div>
                <div className="booking-card-actions">
                  <StatusBadge status={b.status} />
                  <button
                    className="booking-delete-btn"
                    onClick={() => { if (window.confirm('Biztosan törlöd a foglalást?')) deleteBooking(b.id); }}
                  >Törlés</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-bookings">
              <p>Még nincs szállásfoglalásod.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="bookings-list">
          {reservationsLoading ? (
            <p>Betöltés...</p>
          ) : reservations?.length > 0 ? (
            reservations.map((r) => (
              <div key={r.id} className="booking-card">
                <div className="booking-card-info">
                  <h4>🍽️ {r.table?.seats ? `${r.table.seats} személyes asztal` : `Asztal #${r.tableId}`}</h4>
                  {r.table?.restaurant && (
                    <p>🍴 {r.table.restaurant.name}{r.table.restaurant.city ? ` · ${r.table.restaurant.city.name}` : ''}</p>
                  )}
                  <p>{formatDate(r.reservationStart)}{r.reservationStart ? ` · ${formatTime(r.reservationStart)}` : ''}</p>
                </div>
                <div className="booking-card-actions">
                  <StatusBadge status={r.status} />
                  <button
                    className="booking-delete-btn"
                    onClick={() => { if (window.confirm('Biztosan törlöd a foglalást?')) deleteReservation(r.id); }}
                  >Törlés</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-bookings">
              <p>Még nincs asztalfoglalásod.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
