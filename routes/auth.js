const express = require("express");
const db = require("../config/database");

const router = express.Router();

// 회원가입 라우트
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // 데이터베이스에 username과 password 삽입
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    await db.query(query, [username, password]);

    // 회원가입 성공 메시지 반환
    res.status(201).json({ message: "User registered successfully", username });
  } catch (error) {
    // username 중복 등 데이터베이스 에러 처리
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already exists" });
    }
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 로그인 라우트
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // 데이터베이스에서 username과 password 확인
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    const [rows] = await db.query(query, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // 로그인 성공 시 username 반환
    res.json({ username });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
