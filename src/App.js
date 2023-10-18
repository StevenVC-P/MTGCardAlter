import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import axios from "./utils/axiosSetup"
import Header from "./components/MainLayout/Header.jsx";
import CardForm from "./components/MainLayout/CardForm.jsx";
import LeftSidebar from "./components/MainLayout/LeftSidebar.jsx";
import RightSidebar from "./components/MainLayout/RightSidebar.jsx";
import LoginPage from "./pages/LoginPage"; // Import your Login component
import RegisterPage from "./pages/RegistrationPage.jsx";
import UserContext from "./contexts/UserContext";
import "./App.css";

const MainPage = ({ isPatreonConnected }) => {
  const [sidebarText, setSidebarText] = useState("");
  const [sidebarWeight, setSidebarWeight] = useState(5);
  const [counter, setCounter] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);

  const decrementCounter = () => {
    setCounter((prevCounter) => Math.max(0, prevCounter - 1));
  };

  return (
    <div className="container">
      <Header isConnected={isPatreonConnected} />
      <div className="content">
        <LeftSidebar text={sidebarText} weight={sidebarWeight} setText={setSidebarText} setWeight={setSidebarWeight} />
        <CardForm sidebarText={sidebarText} sidebarWeight={sidebarWeight} decrementCounter={decrementCounter} counter={counter} setErrorMessage={setErrorMessage} />
        <RightSidebar counter={counter} errorMessage={errorMessage} />
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isPatreonConnected, setIsPatreonConnected] = useState(false);

  const location = useLocation();
  useEffect(( ) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
    }

    const queryParams = new URLSearchParams(location.search);
    const patreonConnected = queryParams.get("patreonConnected");
    const patreonToken = queryParams.get("token");

    if (patreonConnected === "true" && patreonToken) {
      axios
        .post("http://localhost:5000/patreon/validate-patreon-token", { token: patreonToken })
        .then((response) => {
          if (response.data.valid) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            setIsLoggedIn(true);
            setIsPatreonConnected(true);
          }
        })
        .catch((error) => {
          console.error("Error validating Patreon token:", error.response ? error.response.data : error.message);
        });
    }
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
        {/* <Route 
          path="/login/email" 
          element={!isLoggedIn ? <EmailLoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} 
        /> */}
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
