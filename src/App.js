import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import axios from "./utils/axiosSetup"
import Header from "./components/MainLayout/Header.jsx";
import CardForm from "./components/MainLayout/CardForm.jsx";
import LeftSidebar from "./components/MainLayout/LeftSidebar.jsx";
import RightSidebar from "./components/MainLayout/RightSidebar.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegistrationPage.jsx";
import EmailVerification from "./pages/EmailVerification";
import UserContext from "./contexts/UserContext";
import ErrorComponent from "./components/Shared/ErrorMessage";

import "./App.css";

const MainPage = ({ isPatreonConnected }) => {
  const [sidebarText, setSidebarText] = useState("");
  const [sidebarWeight, setSidebarWeight] = useState(5);
  const [counter, setCounter] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user } = React.useContext(UserContext);

  const [otherValues, setOtherValues] = useState({
    cardName: 1,
    color: 1,
    typeLine: 1,
    keywords: 1,
    tokens: 1,
    favorText: 1,
  });

  useEffect(() => {
    console.log(user)
    if (user && user.id) {
      fetchUserTokens(user.id).then((tokens) => {
        if (tokens !== null) {
          setCounter(tokens);
        }
      });
    }
  }, [user]);

  const fetchUserTokens = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/tokens/${userId}`);
      return response.data.tokens;
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      return null;
    }
  };

  const handleClearError = () => {
    setErrorMessage("");
  };
  const decrementCounter = () => {
    setCounter((prevCounter) => Math.max(0, prevCounter - 1));
  };

  return (
    <div className="container">
      <Header isConnected={isPatreonConnected} />
      <ErrorComponent errorMessage={errorMessage} onClearError={handleClearError} />
      <div className="content">
        <LeftSidebar text={sidebarText} weight={sidebarWeight} setText={setSidebarText} setWeight={setSidebarWeight} otherValues={otherValues} setOtherValues={setOtherValues} />
        <CardForm sidebarText={sidebarText} sidebarWeight={sidebarWeight} otherValues={otherValues} decrementCounter={decrementCounter} counter={counter} setErrorMessage={setErrorMessage} />
        <RightSidebar counter={counter} errorMessage={errorMessage} />
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isPatreonConnected, setIsPatreonConnected] = useState(false);

  const location = useLocation();

useEffect(() => {
  let intervalId;

  // This function is declared async so we can await the validation and refresh token calls
  const fetchData = async () => {
    setIsLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        console.log(accessToken);
        const response = await axios.post("http://localhost:5000/api/auth/validate-access-token", { accessToken });
        setIsLoggedIn(true);
        setUser(response.data.user);
        // Set up the interval only if the access token is valid.
        intervalId = setupRefreshTokenInterval();
      } catch (error) {
        console.error("Token validation error:", error);
        setIsLoggedIn(false);
        setUser(null);
        // If access token validation fails, try to refresh it immediately.
        await refreshAccessToken();
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    // Handle Patreon token validation if necessary
    const queryParams = new URLSearchParams(location.search);
    const patreonConnected = queryParams.get("patreonConnected");
    const patreonToken = queryParams.get("token");

    if (patreonConnected === "true" && patreonToken) {
      try {
        const response = await axios.post("http://localhost:5000/patreon/validate-patreon-token", { token: patreonToken });
        if (response.data.valid) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          setIsLoggedIn(true);
          setIsPatreonConnected(true);
          // After validating Patreon and setting tokens, set up the token refresh interval
          intervalId = setupRefreshTokenInterval();
        }
      } catch (error) {
        console.error("Error validating Patreon token:", error.response ? error.response.data : error.message);
      }
    }
  };

  fetchData();

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/token", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      console.error("Failed to refresh token", error);
      // Handle logout process here
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const setupRefreshTokenInterval = () => {
    return setInterval(() => {
      refreshAccessToken();
    }, 3600 * 1000); // Refresh every hour
  };

  // Cleanup interval on unmount
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [location]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <MainPage isPatreonConnected={isPatreonConnected} /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <RegisterPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
        <Route path="/verify-email" component={EmailVerification} />
        {/* <Route 
          path="/login/email" 
          element={!isLoggedIn ? <EmailLoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} 
        /> */}
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
