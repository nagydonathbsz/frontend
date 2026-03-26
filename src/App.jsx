import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CityDetails from './CityDetails';
import Footer from './Footer'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Token ellenőrzése betöltéskor
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      {/* A Navbar mindig látszik */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          {/* Kezdőlap */}
          <Route path="/" element={<Home />} />
          
          {/* Városok listája (Dashboard) */}
          <Route path="/citys" element={<Dashboard />} />
          
          {/* Város részletei - a :cityId egy változó az URL-ben */}
          <Route path="/citys/:cityId" element={<CityDetails />} />
          
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login onLoginSuccess={() => setIsLoggedIn(true)} /> : <Navigate to="/citys" />} 
          />
          
          <Route path="/register" element={<Register />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;