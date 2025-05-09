import React, { createContext, useState } from "react";
import axios from "axios"; // axios를 사용하여 API 요청
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 사용하여 페이지 이동
// Context 생성
export const AuthContext = createContext();

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null, // 사용자 정보
  });
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로그인 함수 (서버에서 사용자 정보 요청)
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      const user = response.data; // 서버에서 받은 사용자 정보
      setAuth({ user });
      console.log("로그인 성공");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setAuth({ user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
