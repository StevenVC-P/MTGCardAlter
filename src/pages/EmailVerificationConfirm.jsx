import React, { useState , useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig.js';
import { useLocation, useNavigate  } from 'react-router-dom';

const EmailVerificationConfirm  = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.post('/api/auth/verify-email', { token });
        setVerificationSuccessful(true);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate('/'); 
      } catch (error) {
        console.log('Error verifying email:', error);
        setVerificationSuccessful(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>
        {token
          ? 'Verifying your email...'
          : 'No verification token provided.'}
      </p>
      {!verificationSuccessful && token && (
        <p>Verification failed. Please try again or contact support.</p>
      )}
    </div>
  );
};

export default EmailVerificationConfirm ;
