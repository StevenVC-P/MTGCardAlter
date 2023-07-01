import React from "react";
import Header from "./components/header.jsx";
import CardForm from "./components/CardForm";
import "./App.css";

const App = () => {
  return (
    <div className="container">
      <Header />
      <CardForm />
    </div>
  );
};

export default App;