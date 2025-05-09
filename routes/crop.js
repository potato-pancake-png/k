const express = require("express");
const db = require("../config/database");
const axios = require("axios");

const router = express.Router();

// "/api/crops" POST 요청 처리
router.post("/", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // users 테이블에서 username에 해당하는 id 찾기
    const userQuery = "SELECT id FROM users WHERE username = ?";
    const [userRows] = await db.query(userQuery, [username]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userRows[0].id;

    // crops 테이블에서 해당 user_id와 일치하는 데이터 가져오기
    const cropQuery = "SELECT * FROM crops WHERE user_id = ?";
    const [cropRows] = await db.query(cropQuery, [userId]);

    // expected_harvest 값에 따라 status 추가
    const cropsWithStatus = cropRows.map((crop) => ({
      ...crop,
      status: crop.Expected_Harvest ? "done" : "active",
    }));

    res.status(200).json({ crops: cropsWithStatus });
  } catch (error) {
    console.error("Error fetching crops:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // crops 테이블에서 id와 일치하는 데이터 가져오기
    const cropQuery = "SELECT * FROM crops WHERE id = ?";
    const [cropRows] = await db.query(cropQuery, [id]);

    if (cropRows.length === 0) {
      return res.status(404).json({ error: "Crop not found" });
    }

    // 데이터 변환: Location -> location, Planting_Date -> plantingDate
    const cropData = {
      ...cropRows[0],
      location: cropRows[0].Location,
      plantingDate: cropRows[0].Planting_Date,
      status: cropRows[0].Expected_Harvest ? "done" : "active", // status 추가
    };

    // 원래 필드 삭제
    delete cropData.Location;
    delete cropData.Planting_Date;

    res.status(200).json(cropData);
  } catch (error) {
    console.error("Error fetching crop:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// "/api/crops/add" POST 요청 처리
router.post("/add", async (req, res) => {
  const { username, category, planting_date, location } = req.body;

  if (!username || !category || !planting_date || !location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // users 테이블에서 username에 해당하는 id 찾기
    const userQuery = "SELECT id FROM users WHERE username = ?";
    const [userRows] = await db.query(userQuery, [username]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userRows[0].id;

    // crops 테이블에 데이터 삽입
    const cropQuery = `
      INSERT INTO crops (user_id, category, Planting_Date, Location)
      VALUES (?, ?, ?, ?)
    `;
    const [cropResult] = await db.query(cropQuery, [
      userId,
      category,
      planting_date,
      location,
    ]);
    const cropId = cropResult.insertId;
    res.status(201).json({ message: "Crop added successfully!" });
    (async () => {
      try {
        const aiRequest = {
          PlantedArea: location,
          PlantingDate: planting_date,
          CropID: category,
        };
        console.log("AI 요청 데이터:", aiRequest);

        // AI 모델 서버에 POST 요청 (예시 URL: http://localhost:5000/predict)
        const aiResponse = await axios.post(
          "http://192.168.9.185:5000/predict",
          aiRequest
        );
        console.log("AI 수신데이터:", aiResponse.data);

        const recommendList = aiResponse.data; // [{ Expected_Date, Market_name, Price }, ...]
        if (!Array.isArray(recommendList) || recommendList.length === 0) return;

        // recommend 테이블에 추천 결과 저장
        for (const rec of recommendList) {
          const dateObj = new Date(rec.date);
          const formattedDate = dateObj.toISOString().slice(0, 10); // 'YYYY-MM-DD'

          // 가격 변환: 소숫점 버리고 정수로
          const priceInt = Math.floor(rec.net_rev);
          await db.query(
            `INSERT INTO recommend (crop_id, Expected_Date, Market_name, Price, address)
             VALUES (?, ?, ?, ?, ?)`,
            [cropId, formattedDate, rec.Market_name, priceInt, rec.address]
          );
        }

        // 가장 비싼 추천 결과 찾기
        const best = recommendList.reduce((a, b) =>
          a.Price > b.Price ? a : b
        );

        const bestDate = new Date(best.date).toISOString().slice(0, 10);
        // crops 테이블 업데이트
        await db.query(
          `UPDATE crops SET Expected_Harvest = ?, wholesale_market_name = ? WHERE id = ?`,
          [bestDate, best.Market_name, cropId]
        );
      } catch (err) {
        console.error("AI 서버 연동 또는 DB 저장 중 오류:", err.message);
      }
    })();
  } catch (error) {
    console.error("Error adding crop:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// "/api/crops/edit/:id" PUT 요청 처리
// "/api/crops/edit/:id" PUT 요청 처리
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { category, location, plantingDate } = req.body;

  if (!category || !location || !plantingDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // crops 테이블에서 해당 id와 일치하는 행 업데이트
    const updateQuery = `
      UPDATE crops
      SET category = ?, Location = ?, Planting_Date = ?, Expected_Harvest = NULL, wholesale_market_name = NULL
      WHERE id = ?
    `;
    const [result] = await db.query(updateQuery, [
      category,
      location,
      plantingDate,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.status(200).json({ message: "Crop updated successfully!" });
  } catch (error) {
    console.error("Error updating crop:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // crops 테이블에서 해당 id와 일치하는 행 삭제
    const deleteQuery = "DELETE FROM crops WHERE id = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.status(200).json({ message: "Crop deleted successfully!" });
  } catch (error) {
    console.error("Error deleting crop:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
