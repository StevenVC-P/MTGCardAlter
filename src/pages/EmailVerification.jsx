import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EmailVerification = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/verify-email', { token });
        console.log('Email verified:', response.data);
      } catch (error) {
        console.log('Error verifying email:', error);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>
        {token
          ? 'Verifying your email...'
          : 'No verification token provided.'}
      </p>
    </div>
  );
};

export default EmailVerification;
