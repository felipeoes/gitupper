import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  // <React.StrictMode> // commenting to avoid react double render on dev mode
  <App />,
  // </React.StrictMode>
  document.getElementById("root")
);
