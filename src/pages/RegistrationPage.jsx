import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import ValidatedInput from '../components/Inputs/ValidatedInput';

const RegisterPage = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);

  const emailValidator = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const usernameValidator = (username) => username.length >= 3;
  const passwordValidator = (password) => password.length >= 8;

  const register = async () => {
    setShouldValidate(true);

    if(emailValidator(email) && usernameValidator(username) && passwordValidator(password)) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();
        console.log(data)
        if (data.success) {
          localStorage.setItem('authToken', data.token);
          setUser(data.user);
          console.log(data.user)
          setIsLoggedIn(true);
          console.log(navigate("/"))
          navigate("/");
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Registration failed.");
      }
    }
  };

  return (
    <div className="auth-container">
        <div className="card">
            <h2>Register</h2>
            <ValidatedInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validator={emailValidator}
              errorMessage="Please enter a valid email."
              shouldValidate={shouldValidate}
            />
            <ValidatedInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              validator={usernameValidator}
              errorMessage="Username should be at least 3 characters long."
              shouldValidate={shouldValidate}
            />
            <ValidatedInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              validator={passwordValidator}
              errorMessage="Password should be at least 8 characters long."
              shouldValidate={shouldValidate}
            />
            <button onClick={register}>Register</button>
            {message && <p>{message}</p>}
          <div className="requirements-container">
              <h4>Requirements:</h4>
              <ul>
                  <li>Email: Valid email format</li>
                  <li>Username: At least 3 characters long</li>
                  <li>Password: At least 8 characters long</li>
              </ul>
          </div>
        </div>
    </div>
  );
};

export default RegisterPage;
