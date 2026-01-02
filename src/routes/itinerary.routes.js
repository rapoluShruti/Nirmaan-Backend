const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

const {
  getDailyItinerary
} = require("../controllers/itinerary.controller");

/**
 * DAILY ITINERARY (PROJECT LEVEL)
 */
router.get("/:projectId/today", protect, getDailyItinerary);

module.exports = router;
