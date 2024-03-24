import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import axiosInstance from '../utils/axiosConfig.js';
import ValidatedInput from '../components/Inputs/ValidatedInput';

const RegisterPage = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [shouldValidate, setShouldValidate] = useState(false);

  const validateEmail = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      return 'Email is required';
    } else if (!re.test(String(email).toLowerCase())) {
      return 'Invalid email format';
    }
    return '';
  };

  const validateUsername = () => {
    const re = /^[a-zA-Z0-9_]{4,}$/; 
    if (!username) {
      return 'Username is required';
    } else if (!re.test(username)) {
      return 'Username must be at least 4 characters long and only contain letters, numbers, and underscores';
    }
    return '';
  };

  const validatePassword = () => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      return 'Password is required';
    } else if (!re.test(password)) {
      return 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    const emailError = validateEmail();
    if (emailError) errors.push(emailError);

    const usernameError = validateUsername();
    if (usernameError) errors.push(usernameError);

    const passwordError = validatePassword();
    if (passwordError) errors.push(passwordError);

    if (errors.length > 0) {
      setMessages(errors);
    } else {
      setMessages([]); 
      
      try {
        const response = await axiosInstance.post('/api/auth/register', {
          email, 
          username, 
          password
        });

        const data = response.data; 
        if (data.success) {
          // Navigate to the next step or display success message
          navigate('/verify-email-notice', { state: { email } });
        } else {
          // Handle error from the server (e.g., email already in use)
          setMessages([data.message]);
        }
      } catch (error) {
        // Handle network or server error
        setMessages(["Registration failed. Please try again later."]);
      }
    }
  }

  return (
    <div className="auth-container">
      <form className="card" onSubmit={handleSubmit}> {/* Use handleSubmit here */}
        <h1>Arcane-Proxies</h1>
        <h2 className="auth-header">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {/* Updated button to be of type submit */}
        <button type="submit" className="auth-btn">Register</button>
        
        {messages.length > 0 && (
          <ul className="auth-error-message">
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}

        <div className="requirements-container">
          <h4 className="requirements-header">Requirements:</h4>
          <ul className="requirements-list">
            <li>Email: Valid email format</li>
            <li>Username: At least 3 characters long</li>
            <li>Password: At least 8 characters long, including numbers, and symbols</li>
          </ul>
          <p>Have an account?</p>
          <Link to="/login"> Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
