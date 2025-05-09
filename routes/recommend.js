const express = require("express");
const db = require("../config/database");

const router = express.Router();

// "/api/recommend" GET 요청 처리 (예: 모든 추천 데이터 가져오기)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM recommend WHERE crop_id = ?";
    const [rows] = await db.query(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// "/api/recommend/accept" POST 요청 처리
router.post("/accept", async (req, res) => {
  const { id } = req.body; // recommend 테이블의 id

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    // recommend 테이블에서 crop_id, Expected_Date, Price(Market_name) 조회
    const selectQuery =
      "SELECT crop_id, Expected_Date, Market_name FROM recommend WHERE id = ?";
    const [rows] = await db.query(selectQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Recommendation not found" });
    }

    const { crop_id, Expected_Date, Market_name } = rows[0];

    // crops 테이블에 Expected_Harvest, wholesale_market_name 업데이트
    const updateQuery = `
      UPDATE crops
      SET Expected_Harvest = ?, wholesale_market_name = ?
      WHERE id = ?
    `;
    await db.query(updateQuery, [Expected_Date, Market_name, crop_id]);

    res.status(200).json({ message: "Crop updated successfully!" });
  } catch (error) {
    console.error("Error accepting recommendation:", error.message);
    res.status(500).json({ error: "Failed to accept recommendation" });
  }
});

// "/api/recommend" POST 요청 처리 (예: 새로운 추천 데이터 추가)

// "/api/recommend/:id" DELETE 요청 처리 (예: 추천 데이터 삭제)

module.exports = router;
