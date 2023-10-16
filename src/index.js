import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppWrapper from "./AppWrapper"; // Make sure to import AppWrapper

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper /> {/* Use AppWrapper here */}
  </React.StrictMode>,
  document.getElementById("root")
);
