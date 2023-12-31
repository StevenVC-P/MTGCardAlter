import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import ValidatedInput from '../components/Inputs/ValidatedInput';

const RegisterPage = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);

  const emailValidator = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const usernameValidator = (username) => {
    const minLength = 3;
    if (username.length < minLength) {
      return false;
    }
    const validUsernamePattern = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernamePattern.test(username)) {
      return false;
    }
    if (username.includes('@')) {
      return false;
    }
    return true;
  };

  const passwordValidator = (password) => password.length >= 8;

  const register = async () => {
    setShouldValidate(true);

    if(emailValidator(email) && usernameValidator(username) && passwordValidator(password)) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();
        if (data.success) {
          navigate('/verify-email-notice', { state: { email } }); 
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Registration failed.");
      }
    }
  };

  return (
    <div className="auth-container">
        <div className="card">
            <h1>Arcane-Proxies</h1>
            <h2 className="auth-header">Register</h2>
            <ValidatedInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validator={emailValidator}
              errorMessage="Please enter a valid email."
              shouldValidate={shouldValidate}
              className="auth-input"
            />
            <ValidatedInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              validator={usernameValidator}
              errorMessage="Username should be at least 3 characters long."
              shouldValidate={shouldValidate}
              className="auth-input"
            />
            <ValidatedInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              validator={passwordValidator}
              errorMessage="Password should be at least 8 characters long."
              shouldValidate={shouldValidate}
              className="auth-input"
            />
            <button className="auth-btn" onClick={register}>Register</button>
            {message && <p className="auth-error-message">{message}</p>}
          <div className="requirements-container">
              <h4 className="requirements-header">Requirements:</h4>
              <ul className="requirements-list">
                  <li>Email: Valid email format</li>
                  <li>Username: At least 3 characters long</li>
                  <li>Password: At least 8 characters long</li>
              </ul>
            <p>Have an account?</p>
            <Link to="/login"> Login</Link>
          </div>
        </div>
    </div>
  );
};

export default RegisterPage;
