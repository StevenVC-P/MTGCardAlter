import React from "react";
import patreonLogo from '../assets/Patreon Brand Assets/Patreon Wordmark/JPG/Digital-Patreon-Wordmark_FieryCoralOnWhite-Sm.jpg'; // Make sure to provide the correct path to your image

const Header = () => {
  return <div className="header">
    <a href="https://www.patreon.com/ArcaneProxies" target="_blank" rel="noopener noreferrer">
      <img src={patreonLogo} alt="Patreon" className="patreon-button"/>
    </a>
    ArcaneProxy
    <div></div>
  </div>;

};

export default Header;