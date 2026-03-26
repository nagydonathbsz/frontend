import React, { useState } from 'react';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useRoomsByAcco } from './hooks/useRoomsByAcco';
import { useBookRoom } from './hooks/useBookRoom';

function AccommodationDetails({ hotel, onBack }) {
  const { data: user } = useCurrentUser();
  const { data: rooms, isLoading } = useRoomsByAcco(user ? hotel.id : null);
  const { mutate: bookRoom, isPending } = useBookRoom();

  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [form, setForm] = useState({ checkIn: '', checkOut: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
          src={hotel.image || `https://res.cloudinary.com/duqxzcf4e/image/upload/w_1200,h_400,c_fill,g_auto,f_auto,q_auto/${hotel.name?.toLowerCase().replace(/\s+/g, '-')}.jpg`}
          alt={hotel.name}
          onError={(e) => e.target.src = 'https://via.placeholder.com/1200x400?text=EuroTrip'}
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
        <p>Betöltés...</p>
      ) : rooms?.length > 0 ? (
        <div className="grid">
          {rooms.map((room) => (
            <div key={room.id} className="sub-card">
              <h3>🛏️ {room.roomNumber ?? `${room.id}. szoba`}</h3>
              <p>Férőhely: {room.capacity} fő</p>
              <p>Ár: {room.price} €/éj</p>

              {bookingRoomId === room.id ? (
                <form onSubmit={handleBook} className="booking-form">
                  <div className="form-group">
                    <label>Érkezés</label>
                    <input
                      type="date"
                      value={form.checkIn}
                      onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Távozás</label>
                    <input
                      type="date"
                      value={form.checkOut}
                      onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
                      required
                    />
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
                <button className="book-btn" onClick={() => { setBookingRoomId(room.id); setSuccessMsg(''); }}>
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
