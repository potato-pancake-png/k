import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // axios 가져오기
import "./Signup.css"; // Signup.css 가져오기

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인 체크

    try {
      // 서버로 회원가입 데이터 전송
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      // 회원가입 성공 처리
      if (response.status === 201) {
        alert("회원가입이 성공적으로 완료되었습니다.");
        navigate("/login", { replace: true }); // 뒤로가기 방지 후 /login으로 이동
      }
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <p className="signup-subtitle">
        새로운 계정을 생성하여 서비스를 이용하세요.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="terms">
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
          />
          <label htmlFor="termsAccepted">
            서비스 이용약관 및 개인정보 처리방침에 동의합니다.
          </label>
        </div>
        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>
      <p className="login-link">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
};

export default Signup;
