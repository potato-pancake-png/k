const express = require("express");
const db = require("./config/database");
const cors = require("cors");
const requestLogger = require("./middleware/request"); // 요청 로깅 미들웨어 가져오기
const authRoutes = require("./routes/auth"); // auth 라우트 가져오기
const cropRoutes = require("./routes/crop");
const recommendRoutes = require("./routes/recommend"); // 추천 라우트 가져오기

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // 모든 도메인에서의 요청 허용
app.use(express.json()); // JSON 요청 본문 파싱
app.use(requestLogger); // 요청 로깅 미들웨어 추가

// Test database connection
async function testDatabaseConnection() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("MySQL 서버와 연결되었습니다!");
  } catch (error) {
    console.error("MySQL 서버 연결에 실패했습니다:", error.message);
  }
}

// Call the test function
testDatabaseConnection();

// Define a basic route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Auth 라우트 연결
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/recommend", recommendRoutes); // 추천 라우트 연결

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
