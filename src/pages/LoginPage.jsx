/* global FB */
import React, { useEffect } from 'react';
// import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
// import PatreonLogin from 'react-patreon-login';
const LoginPage = ({setIsLoggedIn}) => {

 useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
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
  
  // const responseGoogle = async (response) => {
  //   const tokenId = response.tokenId;
  //   // Send this tokenId to your backend
  //   const res = await fetch('http://localhost:5000/auth/google/token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ token: tokenId })
  //   });
  //   const data = await res.json();
  //   console.log("Response from server:", data);
  // }
  
  const responseFacebook = async (response) => {
    const accessToken = response.accessToken;
    const res = await fetch('https://localhost:5000/auth/facebook/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: accessToken })
    });
    const data = await res.json();
    console.log("Response from server:", data);

    if (data.success) {  // Assuming the server returns { success: true } on successful login
      setIsLoggedIn(true);
    }
  };

// const responsePatreon = async (response) => {
//   const accessToken = response.accessToken; // Replace this line based on how the Patreon response is structured
//   // Send this accessToken to your backend
//   const res = await fetch('http://localhost:5000/auth/patreon/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ token: accessToken })
//   });
//   const data = await res.json();
//   console.log("Response from server:", data);
// };
  
  return (
    <div>
      <h1>Login Page</h1>
      
      {/* <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
       */}
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        fields="name,email,picture"
        callback={responseFacebook}
      />
      
      {/* <PatreonLogin
        clientId="YOUR_PATREON_CLIENT_ID"
        redirectUri="YOUR_PATREON_REDIRECT_URI"
        onSuccess={responsePatreon}
        onFailure={responsePatreon}
        /> */}
    </div>
  );
};

export default LoginPage;