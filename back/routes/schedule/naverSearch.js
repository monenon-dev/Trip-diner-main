import express from "express";
import axios from "axios";
import { NAVER_SEARCH_BASE, naverSearchHeaders } from "../../utils/naverSearch.js";
const router = express.Router();


router.get("/naverSearch", async (req, res) => {
  try {
    const { query } = req.query;

    const url = `${NAVER_SEARCH_BASE}/image?query=${encodeURIComponent(query)}&display=5`;

    const response = await axios.get(url, {
      headers: {
        ...naverSearchHeaders(),
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("NAVER IMAGE SEARCH ERROR", err);
    res.status(500).json({ items: [] });
  }
});

export default router;
