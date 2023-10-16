import React, { useState, useEffect } from "react";
import patreonLogo from '../../assets/Patreon Brand Assets/Patreon Wordmark/JPG/Digital-Patreon-Wordmark_FieryCoralOnWhite-Sm.jpg'; // Make sure to provide the correct path to your image

const Header = ({ isConnected }) => {
  console.log(isConnected)
  const connectWithPatreon = async () => {
    // window.location.href = 'https://www.google.com';
    const token = localStorage.getItem('authToken');
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
      {isConnected ? (
        <>
          <a href="https://www.patreon.com/ArcaneProxies" target="_blank" rel="noopener noreferrer">
            <img src={patreonLogo} alt="Donate on Patreon" className="patreon-button"/>
          </a>
        </>
      ) : (
        <>
          <p>Please connect with Patreon to unlock exclusive features.</p>
          <button onClick={connectWithPatreon} className="connect-patreon-button">Connect with Patreon</button>
        </>
      )}
      ArcaneProxy
    </div>
  );


};

export default Header;