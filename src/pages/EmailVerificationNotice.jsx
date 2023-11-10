import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const EmailVerificationNotice = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const email = location.state?.email;

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Verification email resent. Please check your inbox.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to resend verification email.');
    }
  };

  return (
    <div className="verification-page">
      <h1>Email Verification</h1>
      <p>Please check your email to verify your account. If you did not receive an email, you can <button onClick={resendVerificationEmail}>resend the verification email</button>.</p>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailVerificationNotice;
