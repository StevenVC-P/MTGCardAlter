import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/MainLayout/Header.jsx";
import CardForm from "./components/MainLayout/CardForm.jsx";
import Sidebar from "./components/MainLayout/Sidebar";
import LoginPage from "./pages/LoginPage"; // Import your Login component
import RegisterPage from "./pages/RegistrationPage.jsx";
import EmailLoginPage from "./components/Inputs/EmailLoginForm.jsx";
import UserContext from "./contexts/UserContext";
import "./App.css";

const MainPage = () => {
  const [sidebarText, setSidebarText] = useState("");
  const [sidebarWeight, setSidebarWeight] = useState(5);

  return (
    <div className="container">
      <Header />
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
  // Check on component mount if a token is already present
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} /> {/* updated this line */}
          <Route path="/" element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />} /> {/* updated this line */}
          <Route path="/register" element={!isLoggedIn ? <RegisterPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
          <Route path="/login/email" element={!isLoggedIn ? <EmailLoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
