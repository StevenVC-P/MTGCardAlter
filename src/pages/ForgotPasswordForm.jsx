import React, { useState } from 'react';
import ValidatedInput from '../components/Inputs/ValidatedInput'; 

const ForgotPasswordForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');

  const identifierRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$|^[a-zA-Z0-9_-]+$/; // Adjust as needed for combined email/username validation

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (identifierRegex.test(identifier)) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier }),
        });

        const data = await response.json();
        if (data.success) {
          setMessage("If your email is in our database, you will receive a password reset link shortly.");
        } else {
          setMessage("Failed to send reset email. Please try again.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again later.");
      }
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  return (
    <div className="auth-container">
        <div className="card">
            <h2 className="login-header">Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <ValidatedInput 
                    type="text" 
                    placeholder="Enter your email or username" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className='auth-btn'>Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    </div>
  );
};

export default ForgotPasswordForm;
