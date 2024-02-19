import React, { useState } from 'react';
import ValidatedInput from './ValidatedInput'; 
import axiosInstance from '../../utils/axiosConfig.js';

const EmailLoginForm = ( { onSuccessfulLogin } ) => {
  const [login, setLogin] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const loginValidator = (input) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const usernameRegex = /^[a-zA-Z0-9_-]+$/; // Adjust as needed for username validation
    return emailRegex.test(input) || usernameRegex.test(input);
  };

  const passwordValidator = (password) => {
    return password.length >= 8;
  };

  const handleLogin  = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { login, password });
      const data = await response.data;
      if (data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        onSuccessfulLogin();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Login failed.");
    }
  };

  return (
  <div className="login-container">
  <h2 className="login-header">
    Login with
    <span style={{ display: 'block' }}>Username or Email</span>
  </h2>
    <ValidatedInput
      type="text"
      placeholder="Username or Email"
      value={login}
      onChange={(e) => setLogin(e.target.value)}
      validator={loginValidator}
      errorMessage="Please enter a valid username or email."
      className="login-input"
    />
    <ValidatedInput
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      validator={passwordValidator}
      errorMessage="Password should be at least 8 characters long."
      className="login-input"
    />
    <button className="login-btn" onClick={handleLogin}>Login</button>
    <div className="forgot-password-link">
      <a href="/forgot-password">Forgot Password?</a> 
    </div>
    {message && <p className="login-error-message">{message}</p>}
  </div>
  );
};

export default EmailLoginForm;
