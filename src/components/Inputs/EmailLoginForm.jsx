import React, { useState } from 'react';

const EmailLoginForm = ({ onSuccessfulLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={emailLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailLoginForm;
