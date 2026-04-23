import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-hero">
      <h1>Fedezd fel Európa legszebb városait!</h1>
      <p>
        Tervezd meg álmaid utazását, foglalj szállást és keress kiváló éttermeket egy helyen.
      </p>
      <Link to="/citys">
        <button className="explore-btn">
          Fedezd fel most
        </button>
      </Link>
    </div>
  );
}

export default Home;