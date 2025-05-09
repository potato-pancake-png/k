import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기
import Locations from "../config/location";
import Categories from "../config/category";
import Nav from "../components/nav";
import { AuthContext } from "../src/AuthContext";
import "./Cropadd.css";

const CropAdd = () => {
  const { auth } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [username, setUsername] = useState(auth.user);
  const navigate = useNavigate(); // useNavigate 초기화

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedItem("");
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handlePlantingDateChange = (e) => {
    setPlantingDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryIndex = Categories[selectedCategory][selectedItem];
    const locationIndex = Locations[selectedProvince][selectedCity];

    const requestData = {
      username: username.username,
      category: categoryIndex,
      planting_date: plantingDate,
      location: locationIndex,
    };

    try {
      const response = await fetch("http://localhost:3000/api/crops/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Crop registered successfully!");
        navigate("/dashboard", { replace: true }); // "/dashboard"로 이동하고 뒤로가기 방지
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting crop data:", error);
      alert("An error occurred while registering the crop.");
    }
  };

  return (
    <>
      <Nav />
      <div className="crop-add-container">
        <h1 className="form-title">Register Your Crop</h1>
        <form className="crop-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Crop Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {Object.keys(Categories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="item">Crop Item</label>
              <select
                id="item"
                value={selectedItem}
                onChange={handleItemChange}
                required
                disabled={!selectedCategory}
              >
                <option value="">Select Item</option>
                {selectedCategory &&
                  Object.keys(Categories[selectedCategory]).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plantingDate">Planting Date</label>
              <input
                type="date"
                id="plantingDate"
                value={plantingDate}
                onChange={handlePlantingDateChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="province">Field Location</label>
            <div className="location-select">
              <select
                id="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                required
              >
                <option value="">Select Province</option>
                {Object.keys(Locations).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                required
                disabled={!selectedProvince}
              >
                <option value="">Select City</option>
                {selectedProvince &&
                  Object.keys(Locations[selectedProvince]).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Register Crop
          </button>
        </form>
      </div>
    </>
  );
};

export default CropAdd;
