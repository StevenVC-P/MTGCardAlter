import React, { useState, useEffect } from "react";
import patreonLogo from '../../assets/Patreon Brand Assets/Patreon Wordmark/JPG/Digital-Patreon-Wordmark_FieryCoralOnWhite-Sm.jpg'; // Make sure to provide the correct path to your image

const Header = ({ isConnected }) => {

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('jwt'); // if you have stored the Patreon token separately
    // Redirect to login or any other page you wish after logout
    window.location.href = '/login'; 
  };
  const connectWithPatreon = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5000/patreon/auth/patreon?token=${token}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.redirectURL) {
        window.location.href = data.redirectURL;
      }
    }
  };

return (
  <div className="header">
    <div className="left-header-content">
      {isConnected ? (
        <>
          <p>
            Connect with Patreon <br />
            to create new images.
          </p>
        <a
          href="https://www.patreon.com/ArcaneProxies"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={patreonLogo}
            alt="Donate on Patreon"
            className="patreon-img"
          />
        </a>
        </>
      ) : (
        <>
          <p>
            Connect with Patreon <br />
            to create new images.
          </p>
          <button
            onClick={connectWithPatreon}
            className ="patreon-button"
          >
          <img
            src={patreonLogo}
            alt="Donate on Patreon"
            className="patreon-img"
          />
          </button>
        </>
      )}
    </div>
    <span className="app-name">ArcaneProxy</span>
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  </div>
);
};

export default Header;