require('dotenv').config(); // .env 파일 로드
const mysql = require('mysql2');

// 데이터베이스 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST, // MySQL 서버 호스트
  user: process.env.DB_USER, // MySQL 사용자 이름
  password: process.env.DB_PASSWORD, // MySQL 비밀번호
  database: process.env.DB_NAME, // 사용할 데이터베이스 이름
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10), // 연결 제한
  queueLimit: 0
});

// Promise 기반의 연결 풀 생성
const promisePool = pool.promise();

module.exports = promisePool;