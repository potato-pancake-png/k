import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/nav";
import "./Homepage.css";
import homeImage from "../src/assets/홈화면.jpg";

const Home = () => {
  return (
    <>
      <Nav />
      <div className="homepage-container">
        <div className="banner">
          <div className="banner-content">
            <span className="tagline">Efficient Crop Management</span>
            <h1 className="title">
              Simplify Your Crop Registration & Tracking
            </h1>
            <p className="description">
              CropScribe helps farmers easily register, track, and manage their
              crops in one centralized platform. Save time, improve record
              keeping, and enhance your farm's productivity.
            </p>
            <div className="button-group">
              <Link to="/register">
                <button className="btn btn-primary">Register Your Crop</button>
              </Link>
              <Link to="/dashboard">
                <button className="btn btn-secondary">View Dashboard</button>
              </Link>
            </div>
          </div>
          <img
            src={homeImage}
            alt="Farming Landscape"
            className="banner-image"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
