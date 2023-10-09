/* global FB */
import React, { useEffect } from 'react';
// import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import EmailLoginForm from '../components/Inputs/EmailLoginForm';
import { Link } from 'react-router-dom';
// import PatreonLogin from 'react-patreon-login';
const LoginPage = ({setIsLoggedIn}) => {

 useEffect(() => {
    // Initialize Facebook SDK
    console.log(process.env.REACT_APP_FACEBOOK_CLIENT_ID)
    window.fbAsyncInit = function() {
      FB.init({
        appId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
        cookie: true,
        xfbml: true,
        version: 'v12.0' // Make sure to use the latest version
      });

      FB.AppEvents.logPageView();
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);
  
  const responseFacebook = async (response) => {
    try {
      const accessToken = response.accessToken;
      const res = await fetch('http://localhost:5000/auth/facebook/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: accessToken })
      });

      if (!res.ok) {
        throw new Error('Server response was not ok');
      }

      const data = await res.json();
      console.log("Response from server:", data);

      if (data.success) {  // Assuming the server returns { success: true } on successful login
        setIsLoggedIn(true);
      } else {
      // Handle the error based on the message from the server
      console.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Optionally, show the error to the user using a UI component or alert
    }

  };
  
  const handleSuccessfulEmailLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Login Page</h1>
        
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
          fields="name,email,picture"
          callback={responseFacebook}
        />
        <EmailLoginForm onSuccessfulLogin={handleSuccessfulEmailLogin} />
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;