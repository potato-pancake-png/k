import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/nav";
import Crop from "../components/Crop";
import { AuthContext } from "../src/AuthContext";
import Categories from "../config/category";
import "./Dashboard.css";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2025-05-10"); // 오늘 날짜로 초기화05-10"); // 오늘 날짜로 초기화
  const [currentYear, setCurrentYear] = useState(2025); // 현재 연도 상태
  const [currentMonth, setCurrentMonth] = useState(5); // 현재 월 상태 (1월 = 1, 12월 = 12)
  const navigate = useNavigate();

  const getCategoryNameById = (categoryId) => {
    for (const [group, items] of Object.entries(Categories)) {
      for (const [name, id] of Object.entries(items)) {
        if (id === categoryId) {
          return name;
        }
      }
    }
    return "Unknown Category";
  };

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/crops/", {
          username: auth.user.username,
        });

        const formattedCrops = response.data.crops.map((crop) => {
          const addOneDay = (dateString) => {
            const date = new Date(dateString);
            date.setDate(date.getDate() + 1); // +1일 추가
            return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
          };

          return {
            ...crop,
            Planting_Date: crop.Planting_Date
              ? addOneDay(crop.Planting_Date)
              : null,
            Expected_Harvest: crop.Expected_Harvest
              ? addOneDay(crop.Expected_Harvest)
              : null,
          };
        });

        setCrops(formattedCrops);

        const newEvents = formattedCrops
          .filter((crop) => crop.Expected_Harvest)
          .map((crop) => ({
            date: crop.Expected_Harvest, // 이제 YYYY-MM-DD 형식
            title: `${getCategoryNameById(crop.category)}`,
          }));

        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };

    fetchCrops();
  }, [auth.user]);

  // 월 변경 함수
  const changeMonth = (direction) => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth + direction;
      if (newMonth < 1) {
        setCurrentYear((prevYear) => prevYear - 1);
        newMonth = 12;
      } else if (newMonth > 12) {
        setCurrentYear((prevYear) => prevYear + 1);
        newMonth = 1;
      }
      return newMonth;
    });
  };

  // 해당 월의 일 수 계산
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  return (
    <>
      <div className="dashboard-container">
        <Nav />
        <h1 className="dashboard-title">Your Crop Dashboard</h1>
        <h2 className="dashboard-subtitle">Your Crop Registry</h2>
        <button
          className="btn btn-register"
          onClick={() => navigate("/register")}
        >
          Register New Crop
        </button>
        <div className="crop-cards">
          {crops.length > 0 ? (
            crops.map((crop) => (
              <Crop key={crop.id} crop={crop} status={crop.status} />
            ))
          ) : (
            <p>No crops available.</p>
          )}
        </div>

        <div className="calendar-section">
          <h2 className="calendar-title">Plan Your Crop Calendar</h2>
          <p className="calendar-subtitle">
            Select dates for planting, maintenance, and harvesting your crops
          </p>
          <div className="calendar-container">
            <div className="calendar">
              <h3 className="calendar-header">
                <button onClick={() => changeMonth(-1)}>◀</button>
                {currentYear}년 {currentMonth}월
                <button onClick={() => changeMonth(1)}>▶</button>
              </h3>
              <div className="calendar-body">
                <div className="calendar-grid">
                  {[...Array(getDaysInMonth(currentYear, currentMonth))].map(
                    (_, i) => {
                      const day = i + 1;
                      const monthStr = currentMonth.toString().padStart(2, "0");
                      const dayStr = day.toString().padStart(2, "0");
                      const date = `${currentYear}-${monthStr}-${dayStr}`; // YYYY-MM-DD 포맷
                      const isSelected = selectedDate === date;
                      const hasEvent = events.some(
                        (event) => event.date === date
                      );

                      return (
                        <button
                          key={day}
                          className={`calendar-day ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {day}
                          {hasEvent && (
                            <span className="calendar-event-dot"></span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="reminders">
              <h3 className="reminders-header">
                <span role="img" aria-label="reminder">
                  📅
                </span>{" "}
                Crop Reminders
              </h3>
              <div className="reminders-body">
                <ul>
                  {events.map((event, index) => (
                    <li key={index} className="reminder-item">
                      <span className="reminder-event-dot"></span> {event.date}{" "}
                      - {event.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
