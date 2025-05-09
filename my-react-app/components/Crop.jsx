import React from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 가져오기
import "./Crop.css";
import Categories from "../config/category";
import Locations from "../config/location";
import Icons from "../config/icon"; // 아이콘 가져오기

const Crop = ({ crop, status }) => {
  const getCategoryName = (categoryId) => {
    for (const [key, value] of Object.entries(Categories)) {
      for (const [name, id] of Object.entries(value)) {
        if (id === categoryId) return name;
      }
    }
    return "Unknown Category";
  };

  const getLocationName = (locationId) => {
    for (const [key, value] of Object.entries(Locations)) {
      for (const [name, id] of Object.entries(value)) {
        if (id === locationId) return name;
      }
    }
    return "Unknown Location";
  };

  const statusClass =
    status === "active" ? "crop-status-active" : "crop-status-done";

  // 날짜에 +1일 추가
  const addOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate());
    return date.toLocaleDateString(); // 로컬 날짜 형식으로 변환
  };

  return (
    <div className="crop-card">
      <div className="crop-header">
        <Link to={`/cropview/${crop.id}`} className="crop-name-link">
          <div>
            <h3 className="crop-name">{getCategoryName(crop.category)}</h3>
          </div>
        </Link>
        <span className={`${statusClass}`}>
          {status === "active" ? "Active" : "Done"}
        </span>
      </div>
      <div className="crop-icon">
        <img
          src={Icons[crop.category]}
          alt={getCategoryName(crop.category)}
          className="crop-image"
        />
      </div>
      <div className="crop-details">
        <p>
          <strong>Planting Date:</strong> {addOneDay(crop.Planting_Date)}{" "}
          {/* +1일 적용 */}
        </p>
        <p>
          <strong>Expected Harvest:</strong>{" "}
          {crop.Expected_Harvest
            ? addOneDay(crop.Expected_Harvest) /* +1일 적용 */
            : "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {getLocationName(crop.Location)}
        </p>
        <p>
          <strong>Market:</strong> {crop.wholesale_market_name || "N/A"}
        </p>
      </div>
      <div className="crop-actions">
        <Link to={`/cropedit/${crop.id}`} className="crop-name-link">
          <button className="btn btn-edit">Edit</button>
        </Link>
      </div>
    </div>
  );
};

export default Crop;
