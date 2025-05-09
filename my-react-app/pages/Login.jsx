import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 가져오기
import { AuthContext } from "../src/AuthContext"; // AuthContext 가져오기
import "./Login.css";
import Nav from "../components/nav";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); // AuthContext에서 login 함수 가져오기
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // login 함수 호출 (AuthContext에서 정의된 함수)
      await login({ username, password });
      // 뒤로가기 방지 후 /home으로 이동
    } catch (error) {
      console.error("로그인 실패:", error.message);
    }
  };

  return (
    <>
      <Nav />
      <div className="login-container">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">계정에 로그인하여 서비스를 이용하세요.</p>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              id="email"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-wrapper">
              <input
                type="password"
                id="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
          <div className="signup-link">
            아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
