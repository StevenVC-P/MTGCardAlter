import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./components/MainLayout/Header.jsx";
import CardForm from "./components/MainLayout/CardForm.jsx";
import Sidebar from "./components/MainLayout/Sidebar";
import LoginPage from "./pages/LoginPage"; // Import your Login component
import RegisterPage from "./pages/RegistrationPage.jsx";
import EmailLoginPage from "./components/Inputs/EmailLoginForm.jsx";
import UserContext from "./contexts/UserContext";
import "./App.css";

const MainPage = ({ isPatreonConnected }) => {
  console.log("MainPage mounted");
  const [sidebarText, setSidebarText] = useState("");
  const [sidebarWeight, setSidebarWeight] = useState(5);
  const location = useLocation();
  console.log("Entered MainPage");
  useEffect(() => {
    console.log("useEffect is running"); // Debugging line
    const queryParams = new URLSearchParams(location.search);
    const patreonConnected = queryParams.get("patreonConnected");
    const token = queryParams.get("token");

    console.log("Query Params:", queryParams.toString()); // Debugging line

    if (patreonConnected === "true" && token) {
      console.log("Patreon is connected with token:", token);
      // Handle Patreon connection logic here
    } else {
      console.log("Patreon is not connected or token is missing"); // Debugging line
    }
  }, [location]);

  return (
    <div className="container">
      <Header isConnected={isPatreonConnected} />
      <div className="content">
        <Sidebar text={sidebarText} weight={sidebarWeight} setText={setSidebarText} setWeight={setSidebarWeight} />
        <CardForm sidebarText={sidebarText} sidebarWeight={sidebarWeight} />
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // add this line
  const [user, setUser] = useState(null);
  const [isPatreonConnected, setIsPatreonConnected] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
    }

    const queryParams = new URLSearchParams(location.search);
    const patreonConnected = queryParams.get("patreonConnected");
    const patreonToken = queryParams.get("token");

    if (patreonConnected === "true" && patreonToken) {
      // Validate the Patreon token server-side
      console.log(patreonToken);
      axios
        .post("http://localhost:5000/patreon/validate-patreon-token", { token: patreonToken })
        .then((response) => {
          console.log("Axios Response:", response);
          if (response.data.valid) {
            localStorage.setItem("jwt", patreonToken);
            setIsLoggedIn(true);
            setIsPatreonConnected(true); 
          }
        })
        .catch((error) => {
          console.error("Error validating Patreon token:", error);
        });
    }
  }, [location]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} /> {/* updated this line */}
        <Route path="/" element={isLoggedIn ? <MainPage isPatreonConnected = {isPatreonConnected} /> : <Navigate to="/login" />} /> {/* updated this line */}
        <Route path="/register" element={!isLoggedIn ? <RegisterPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/login/email" element={!isLoggedIn ? <EmailLoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
