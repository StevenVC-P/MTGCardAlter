import React, { useState } from 'react';

const PasswordResetForm = () => {
  const [token] = useState(new URLSearchParams(window.location.search).get('token'));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Add more password validations as required

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setIsResetSuccessful(true);
        setMessage("Your password has been successfully reset. You can now log in with your new password.");
        // Redirect to login page or provide a link
      } else {
        setIsResetSuccessful(false);
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
        <div className="card">
            <h2 className="login-header">Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <input 
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className='auth-btn'>Reset Password</button>
            </form>
            {message && 
            <div>
            <p>{message}</p>
                {isResetSuccessful  && <a href="/login">Click here to log in</a>}
            </div>
            }
        </div>
    </div>
  );
};

export default PasswordResetForm;
