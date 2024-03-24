import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig.js';
import { useLocation } from 'react-router-dom';

const EmailVerificationNotice = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const email = location.state?.email;

  const resendVerificationEmail = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/resend', {
        email
      });

      const data = response.data; // With axios, you get the JSON data directly from the response object
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
    <div className="auth-container">
        <div className="card">
          <h1>Email Verification</h1>
          <p>Please check your email to verify your account. If you did not receive an email, you can resend the verification email</p>
          <button className="resend-btn" onClick={resendVerificationEmail}>Resend</button>
          {message && <p>{message}</p>}
        </div>
    </div>
  );
};

export default EmailVerificationNotice;
