import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); // Kijelentkezés után főoldalra dob
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          EuroTrip ✈️
        </Link>

                <div className="nav-links">
          <Link to="/" className="nav-btn">Kezdőlap</Link>
          <Link to="/citys" className="nav-btn">Városok</Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-btn">Profilom</Link>
              <button className="nav-btn logout-style" onClick={handleLogoutClick}>
                Kijelentkezés
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-btn login-style">Bejelentkezés</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;