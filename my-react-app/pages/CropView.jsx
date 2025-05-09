import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CropView.css";
import Nav from "../components/nav";
import Icons from "../config/icon";
import Locations from "../config/location";

const CropView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [markets, setMarkets] = useState([]); // 추천 공판장 데이터 상태

  // Location ID를 문자열로 변환하는 함수
  const getLocationNameById = (locationId) => {
    for (const province in Locations) {
      for (const city in Locations[province]) {
        if (Locations[province][city] === locationId) {
          return { province, city };
        }
      }
    }
    return { province: "알 수 없음", city: "알 수 없음" };
  };

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const cropResponse = await axios.get(
          `http://localhost:3000/api/crops/${id}`
        );
        setCrop(cropResponse.data);
        console.log("Crop data:", cropResponse.data);
      } catch (error) {
        console.error("Error fetching crop data:", error);
      }
    };

    const fetchMarketData = async () => {
      try {
        const marketResponse = await axios.get(
          `http://localhost:3000/api/recommend/${id}`
        );
        setMarkets(marketResponse.data); // 서버에서 받은 추천 공판장 데이터로 상태 업데이트
        console.log("Market data:", marketResponse.data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchCropData();
    fetchMarketData();
  }, [id]);

  if (!crop) {
    return <p>Loading...</p>;
  }

  const { province, city } = getLocationNameById(crop.location);
  const locationDisplay = province === city ? province : `${province} ${city}`;

  return (
    <div className="CropView-container">
      <Nav />
      <div className="CropView-header">
        <div className="CropView-main-wrapper">
          {/* 이미지와 상태 */}
          <div className="CropView-image-status-wrapper">
            <img
              src={Icons[crop.category]}
              alt={crop.name}
              className="CropView-crop-icon"
            />
            <span
              className={`CropView-crop-status-${
                crop.status === "active" ? "active" : "done"
              }`}
            >
              {crop.status === "active" ? "ACTIVE" : "DONE"}
            </span>
          </div>
          {/* 작물 정보 */}
          <div className="CropView-crop-info">
            <ul>
              <li>
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                <strong>작물 심은 날짜:</strong>{" "}
                {crop.plantingDate
                  ? (() => {
                      const date = new Date(crop.plantingDate);
                      date.setDate(date.getDate() + 1);
                      return date.toISOString().split("T")[0];
                    })()
                  : "N/A"}
              </li>
              <li>
                <span role="img" aria-label="calendar">
                  📅
                </span>{" "}
                <strong>예상 수확 날짜:</strong>{" "}
                {crop.Expected_Harvest
                  ? (() => {
                      const date = new Date(crop.Expected_Harvest);
                      date.setDate(date.getDate() + 1);
                      return date.toISOString().split("T")[0];
                    })()
                  : "N/A"}
              </li>
              <li>
                <span role="img" aria-label="location">
                  📍
                </span>{" "}
                <strong>위치:</strong> {locationDisplay}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI 추천 공판장 섹션 */}
      <div className="CropView-market-recommendations">
        <h2>AI 추천 공판장</h2>
        <div className="CropView-market-cards">
          {crop.status === "done"
            ? markets.map((market) => (
                <div key={market.id} className="CropView-market-card">
                  <h3>{market.Market_name}</h3>
                  <p>{market.address}</p>
                  <strong>예상 수확 날짜:</strong>{" "}
                  {market.Expected_Harvest || market.Expected_Date
                    ? (() => {
                        const date = new Date(
                          market.Expected_Harvest || market.Expected_Date
                        );
                        date.setDate(date.getDate() + 1);
                        return date.toISOString().split("T")[0];
                      })()
                    : "N/A"}
                  <p>
                    <strong>가격 (700kg):</strong>{" "}
                    {market.price || market.Price} 원
                  </p>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await axios.post(
                          "http://localhost:3000/api/recommend/accept",
                          {
                            id: market.id,
                          }
                        );
                        alert("선택이 완료되었습니다.");
                        navigate(`/cropview/${id}`);
                      } catch (error) {
                        alert("선택에 실패했습니다.");
                      }
                    }}
                  >
                    <button type="submit">선택</button>
                  </form>
                </div>
              ))
            : Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="CropView-market-card"
                  style={{ minHeight: 100, background: "#f5f5f5" }}
                >
                  {/* 빈 카드 */}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CropView;
