import React, { useState } from "react";
import Header from "./components/Header.jsx";
import CardForm from "./components/CardForm";
import Sidebar from "./components/Sidebar";
import "./App.css";

const App = () => {
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

export default App;
