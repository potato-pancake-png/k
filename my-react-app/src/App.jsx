import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homepage";
import Login from "../pages/Login"; // Login 컴포넌트 추가
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Cropadd from "../pages/Cropadd"; // Cropadd 컴포넌트 추가
import Cropedit from "../pages/Cropedit"; // Cropedit 컴포넌트 추가
import CropView from "../pages/CropView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Cropadd />} />
      <Route path="/cropedit/:id" element={<Cropedit />} />
      <Route path="/cropview/:id" element={<CropView />} />
    </Routes>
  );
}

export default App;
