import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CityDetails from './CityDetails';
import Profile from './Profile';
import Footer from './Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useCurrentUser } from './hooks/useCurrentUser';
import './App.css';

function App() {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();
  const hideFooter = ['/login', '/register', '/profile'].includes(location.pathname);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className="app-container">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/citys" element={<Dashboard />} />

          <Route path="/citys/:cityId" element={<CityDetails />} />

          <Route
            path="/login"
            element={!isLoading && user ? <Navigate to="/citys" replace /> : <Login />}
          />

          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
