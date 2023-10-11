import React, { useState, useEffect } from 'react';
import EmailLoginForm from '../components/Inputs/EmailLoginForm';
import { Link } from 'react-router-dom';
const LoginPage = ({ setIsLoggedIn }) => {
  const [error, setError] = useState(null);
  
  const handleSuccessfulEmailLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Arcane Proxy</h1>
      
        <EmailLoginForm onSuccessfulLogin={handleSuccessfulEmailLogin} />
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;