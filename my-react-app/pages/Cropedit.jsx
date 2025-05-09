import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Locations from "../config/location";
import Categories from "../config/category";
import Nav from "../components/nav";
import "./Cropedit.css"; // Cropadd와 동일한 스타일 사용

const CropEdit = () => {
  const { id } = useParams(); // URL에서 id 파라미터 가져오기
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [plantingDate, setPlantingDate] = useState("");

  // 인덱스를 이름으로 변환하는 함수
  const getCategoryNameById = (id) => {
    for (const [category, items] of Object.entries(Categories)) {
      for (const [name, index] of Object.entries(items)) {
        if (index === id) return { category, name };
      }
    }
    return { category: "", name: "" };
  };

  const getLocationNameById = (id) => {
    for (const [province, cities] of Object.entries(Locations)) {
      for (const [city, index] of Object.entries(cities)) {
        if (index === id) return { province, city };
      }
    }
    return { province: "", city: "" };
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/crops/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch crop data");
        }
        const data = await response.json();

        // 서버에서 받은 인덱스를 이름으로 변환
        const { category, name } = getCategoryNameById(data.category);
        const { province, city } = getLocationNameById(data.location);

        // 날짜에 +1일 추가
        const addOneDay = (dateString) => {
          const date = new Date(dateString);
          date.setDate(date.getDate() + 1); // +1일 추가
          return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
        };

        // 초기값 설정
        setSelectedCategory(category);
        setSelectedItem(name);
        setSelectedProvince(province);
        setSelectedCity(city);
        setPlantingDate(data.plantingDate ? addOneDay(data.plantingDate) : ""); // +1일 적용
      } catch (error) {
        console.error("Error fetching crop data:", error);
        alert("Failed to load crop data.");
      }
    };

    fetchCropData();
  }, [id]);

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

    // 이름을 인덱스로 변환
    const categoryIndex = Categories[selectedCategory][selectedItem];
    const cityIndex = Locations[selectedProvince][selectedCity];

    // 날짜에 +1일 추가
    const adjustedPlantingDate = new Date(plantingDate);

    const requestData = {
      category: categoryIndex,
      location: cityIndex,
      plantingDate: adjustedPlantingDate.toISOString().split("T")[0], // YYYY-MM-DD 포맷
    };

    console.log(requestData);

    try {
      const response = await fetch(
        `http://localhost:3000/api/crops/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        alert("Crop updated successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating crop data:", error);
      alert("An error occurred while updating the crop.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/crops/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Crop deleted successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
      alert("An error occurred while deleting the crop.");
    }
  };

  return (
    <>
      <Nav />
      <div className="crop-add-container">
        <h1 className="form-title">Edit Your Crop</h1>
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
                value={plantingDate || ""}
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CropEdit;
