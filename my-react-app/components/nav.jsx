import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../src/AuthContext"; // AuthContext 가져오기
import "./nav.css";

const Nav = () => {
  const { auth, logout } = useContext(AuthContext); // auth와 logout 함수 가져오기

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="../src/assets/favicon.png" alt="Logo" className="logo-icon" />
        <span className="logo-text">Crob</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/register">Register Crop</Link>
        </li>
      </ul>
      <div className="navbar-buttons">
        {auth.user ? (
          <button className="btn logout-btn" onClick={logout}>
            Log out
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="btn login-btn">Log in</button>
            </Link>
            <Link to="/signup">
              <button className="btn signup-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
