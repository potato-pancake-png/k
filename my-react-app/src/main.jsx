import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./AuthContext"; // AuthProvider 추가
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
