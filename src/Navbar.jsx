import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useLogout } from './hooks/useLogout';

function Navbar() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const handleLogoutClick = () => {
    logout(undefined, { onSuccess: () => navigate('/') });
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

          {user ? (
            <>
              <Link to="/profile" className="nav-btn">{user.name}</Link>
              <button className="nav-btn logout-link" onClick={handleLogoutClick}>
                Kijelentkezés
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-btn login-link">Bejelentkezés</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
