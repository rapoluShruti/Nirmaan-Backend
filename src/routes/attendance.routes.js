const express = require("express");
const router = express.Router();
const attCtrl = require("../controllers/attendance.controller");
const { protect } = require("../middleware/auth.middleware");

// GET today's requirements
router.get("/data/:projectId", protect, attCtrl.getProjectDailyData);

// POST mark attendance - Check if attCtrl.markAttendance exists
router.post("/mark", protect, attCtrl.markAttendance);

// POST add worker - Check if attCtrl.addWorker exists
router.post("/worker", protect, attCtrl.addWorker);

module.exports = router;