import React, { useState } from 'react';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useTablesByRestaurant } from './hooks/useTablesByRestaurant';
import { useReserveTable } from './hooks/useReserveTable';

const MAX_TABLE_IMAGES = 10;

function RestaurantDetails({ restaurant, onBack, cityOffset = 0, maxImages = 74 }) {
  const { data: user } = useCurrentUser();
  const { data: tables, isLoading } = useTablesByRestaurant(user ? restaurant.id : null);
  const { mutate: reserveTable, isPending } = useReserveTable();

  const [reservingTableId, setReservingTableId] = useState(null);
  const [form, setForm] = useState({ resDate: '', resTime: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const maxDate = (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().split('T')[0]; })();
  const maxDateDisplay = (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toLocaleDateString('hu-HU'); })();

  const handleReserve = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const [h, m] = form.resTime.split(':').map(Number);
    const endH = String(h + 2).padStart(2, '0');
    reserveTable(
      {
        userId: user.id,
        tableId: reservingTableId,
        reservationStart: `${form.resDate}T${form.resTime}:00`,
        reservationEnd: `${form.resDate}T${endH}:${String(m).padStart(2, '0')}:00`,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Foglalás sikeres!');
          setReservingTableId(null);
          setForm({ resDate: '', resTime: '' });
        },
        onError: (err) => setErrorMsg(err.message),
      }
    );
  };

  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>← Vissza a listához</button>

      <div className="detail-hero">
        <img
          src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_1200,h_400,c_fill,g_auto,f_auto,q_auto/rest-${((restaurant.id + cityOffset) % maxImages) + 1}.jpg`}
          alt={restaurant.name}
          onError={(e) => e.target.src = 'https://via.placeholder.com/1200x400?text=EuroTrip+Étterem'}
        />
        <div className="hero-text">
          <h1>{restaurant.name}</h1>
        </div>
      </div>

      <div className="detail-info">
        <p>📍 {restaurant.address}</p>
        {restaurant.phone && <p>📞 {restaurant.phone}</p>}
      </div>

      {successMsg && <div className="profile-success-msg">{successMsg}</div>}

      <h2 className="section-title">Elérhető asztalok</h2>

      {!user ? (
        <p className="login-required-msg">Az asztalok megtekintéséhez és foglaláshoz <a href="/login">be kell jelentkezni</a>.</p>
      ) : isLoading ? (
        <div className="loading-spinner-wrapper"><div className="loading-spinner"></div></div>
      ) : tables?.length > 0 ? (
        <div className="grid">
          {tables.map((table) => (
            <div key={table.id} className="sub-card">
              <div className="image-wrapper">
                <img 
                    src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_300,h_200,c_fill,g_auto,f_auto,q_auto/table-${((table.id + cityOffset) % MAX_TABLE_IMAGES) + 1}.jpg`} 
                    alt="Asztal"
                    className="dynamic-card-img img-loaded"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Asztal'}
                />
              </div>
              <h3>🍽️ Asztal</h3>
              <p>Férőhely: {table.seats} fő</p>

              {reservingTableId === table.id ? (
                <form onSubmit={handleReserve} className="booking-form">
                  <div className="form-group">
                    <label>Dátum</label>
                    <input
                      type="date"
                      value={form.resDate}
                      min={today}
                      max={maxDate}
                      onChange={(e) => setForm((f) => ({ ...f, resDate: e.target.value }))}
                      required
                    />
                    <small className="date-hint">Legkésőbbi időpont: {maxDateDisplay}</small>
                  </div>
                  <div className="form-group">
                    <label>Időpont</label>
                    <input
                      type="time"
                      value={form.resTime}
                      min="10:00"
                      max="20:00"
                      onChange={(e) => setForm((f) => ({ ...f, resTime: e.target.value }))}
                      required
                    />
                    <small className="date-hint">Foglalás 10:00 és 20:00 között lehetséges</small>
                  </div>
                  {errorMsg && <div className="error-msg">{errorMsg}</div>}
                  <div className="profile-actions">
                    <button type="submit" className="book-btn" disabled={isPending}>
                      {isPending ? 'Foglalás...' : 'Foglalás megerősítése'}
                    </button>
                    <button
                      type="button"
                      className="profile-cancel-btn"
                      onClick={() => { setReservingTableId(null); setErrorMsg(''); }}
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              ) : user ? (
                <button className="book-btn" onClick={() => { setReservingTableId(table.id); setForm({ resDate: '', resTime: '' }); setErrorMsg(''); setSuccessMsg(''); }}>
                  Foglalás
                </button>
              ) : (
                <p className="login-required-msg">A foglaláshoz <a href="/login">be kell jelentkezni</a>.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Nincs elérhető asztal.</p>
      )}
    </div>
  );
}

export default RestaurantDetails;