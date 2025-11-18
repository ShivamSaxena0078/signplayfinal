const express = require("express");
const axios = require("axios");

const router = express.Router();

// POST /api/gesture/predict
router.post("/predict", async (req, res) => {
  try {
    const { image } = req.body; // image = dataURL string from frontend

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await axios.post("http://localhost:5001/predict", {
      image,
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Gesture prediction failed:", err.message);
    return res.status(500).json({ error: "gesture_prediction_failed" });
  }
});

module.exports = router;