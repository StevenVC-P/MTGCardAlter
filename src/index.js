import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppWrapper from "./AppWrapper";

// const link = document.createElement("link");
// link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap";
// link.rel = "stylesheet";
// link.crossOrigin = "anonymous";
// document.head.appendChild(link);

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById("root")
);
