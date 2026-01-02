
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

const {
  createTask,
  getSupervisorTasks,
  startTask,
  completeTask,
  approveTask,
  rejectTask,
  getPendingApprovals,
  getManagerTasks,
} = require("../controllers/task.controller");

/**
 * TASK CREATION
 */
router.post("/", protect, createTask);

/**
 * SUPERVISOR FLOW
 */
router.get("/supervisor", protect, getSupervisorTasks);
router.post("/:id/start", protect, startTask);
router.post("/:id/complete", protect, completeTask);
router.get("/pending-approval", protect, getPendingApprovals);
router.post("/:id/approve", protect, approveTask);
router.post("/:id/reject", protect, rejectTask);
// routes/task.routes.js
router.get("/manager", protect, getManagerTasks);

module.exports = router;
