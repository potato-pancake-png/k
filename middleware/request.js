module.exports = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Body:", req.body);
  }
  next(); // 다음 미들웨어로 이동
};
