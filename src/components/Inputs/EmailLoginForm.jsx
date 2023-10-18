import React, { useState } from 'react';
import ValidatedInput from './ValidatedInput'; 

const EmailLoginForm = ( { onSuccessfulLogin } ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
    const emailValidator = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const passwordValidator = (password) => {
    return password.length >= 8;
  };

  const emailLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
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
    <div>
      <h2>Login with Email</h2>
      <ValidatedInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validator={emailValidator}
        errorMessage="Please enter a valid email."
      />
      <ValidatedInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        validator={passwordValidator}
        errorMessage="Password should be at least 8 characters long."
      />
      <button onClick={emailLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailLoginForm;
