import React, { useState } from 'react';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useRoomsByAcco } from './hooks/useRoomsByAcco';
import { useBookRoom } from './hooks/useBookRoom';

const MAX_ROOM_IMAGES = 10; 

function AccommodationDetails({ hotel, onBack, cityOffset = 0, maxImages = 68 }) {
  const { data: user } = useCurrentUser();
  const { data: rooms, isLoading } = useRoomsByAcco(user ? hotel.id : null);
  const { mutate: bookRoom, isPending } = useBookRoom();

  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [form, setForm] = useState({ checkIn: '', checkOut: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const maxDate = (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().split('T')[0]; })();
  const maxDateDisplay = (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toLocaleDateString('hu-HU'); })();

  const handleBook = (e) => {
    e.preventDefault();
    setErrorMsg('');
    bookRoom(
      {
        userId: user.id,
        roomId: bookingRoomId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Foglalás sikeres!');
          setBookingRoomId(null);
          setForm({ checkIn: '', checkOut: '' });
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
          src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_1200,h_400,c_fill,g_auto,f_auto,q_auto/hotel-${((hotel.id + cityOffset) % maxImages) + 1}.jpg`}
          alt={hotel.name}
          onError={(e) => e.target.src = 'https://via.placeholder.com/1200x400?text=EuroTrip+Szállás'}
        />
        <div className="hero-text">
          <h1>{hotel.name}</h1>
        </div>
      </div>

      <div className="detail-info">
        <p>📍 {hotel.address}</p>
        {hotel.phone && <p>📞 {hotel.phone}</p>}
      </div>

      {successMsg && <div className="profile-success-msg">{successMsg}</div>}

      <h2 className="section-title">Elérhető szobák</h2>

      {!user ? (
        <p className="login-required-msg">A szobák megtekintéséhez és foglaláshoz <a href="/login">be kell jelentkezni</a>.</p>
      ) : isLoading ? (
        <div className="loading-spinner-wrapper"><div className="loading-spinner"></div></div>
      ) : rooms?.length > 0 ? (
        <div className="grid">
          {rooms.map((room) => (
            <div key={room.id} className="sub-card">
              <div className="image-wrapper">
                <img 
                    src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_300,h_200,c_fill,g_auto,f_auto,q_auto/room-${((room.id + cityOffset) % MAX_ROOM_IMAGES) + 1}.jpg`} 
                    alt="Szoba"
                    className="dynamic-card-img img-loaded"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Szoba'}
                />
              </div>
              <h3>🛏️ Szoba</h3>
              <p>Férőhely: {room.capacity} fő</p>
              <p>Ár: {room.price} €/éj</p>

              {bookingRoomId === room.id ? (
                <form onSubmit={handleBook} className="booking-form">
                  <div className="form-group">
                    <label>Érkezés</label>
                    <input
                      type="date"
                      value={form.checkIn}
                      min={today}
                      max={maxDate}
                      onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value, checkOut: '' }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Távozás</label>
                    <input
                      type="date"
                      value={form.checkOut}
                      min={form.checkIn || today}
                      max={maxDate}
                      onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
                      required
                    />
                    <small className="date-hint">Legkésőbbi időpont: {maxDateDisplay}</small>
                  </div>
                  {errorMsg && <div className="error-msg">{errorMsg}</div>}
                  <div className="profile-actions">
                    <button type="submit" className="book-btn" disabled={isPending}>
                      {isPending ? 'Foglalás...' : 'Foglalás megerősítése'}
                    </button>
                    <button
                      type="button"
                      className="profile-cancel-btn"
                      onClick={() => { setBookingRoomId(null); setErrorMsg(''); }}
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              ) : user ? (
                <button className="book-btn" onClick={() => { setBookingRoomId(room.id); setForm({ checkIn: '', checkOut: '' }); setErrorMsg(''); setSuccessMsg(''); }}>
                  Foglalás
                </button>
              ) : (
                <p className="login-required-msg">A foglaláshoz <a href="/login">be kell jelentkezni</a>.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Nincs elérhető szoba.</p>
      )}
    </div>
  );
}

export default AccommodationDetails;