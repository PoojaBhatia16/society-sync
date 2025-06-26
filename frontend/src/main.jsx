import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // <- Make sure path sahi ho
import "./index.css"; // Tailwind wala

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
