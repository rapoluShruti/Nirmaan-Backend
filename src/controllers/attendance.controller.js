const Task = require("../models/Task");
const Worker = require("../models/Worker");
const Attendance = require("../models/Attendance");

// Ensure this matches the name used in your routes
exports.getProjectDailyData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const activeTasks = await Task.find({
      projectId: projectId,
      isLocked: false,
      $or: [
        { startDate: { $gte: start, $lte: end } },
        { autoCarriedForward: true } 
      ]
    });

    const totalNeeded = activeTasks.reduce((sum, task) => sum + (task.workersRequired || 0), 0);
    const workerPool = await Worker.find({ projectId });

    res.status(200).json({ success: true, totalNeeded, workerPool });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Ensure this name matches exactly in attendance.routes.js
exports.markAttendance = async (req, res) => {
  try {
    const { projectId, workerIds, totalNeeded } = req.body;
    const todayStr = new Date().toISOString().split('T')[0];

    const delayedTasks = await Task.find({
      projectId,
      isLocked: false,
      endDate: { $lt: new Date() }
    });

    const isFlagged = (workerIds.length >= totalNeeded) && (totalNeeded > 0) && (delayedTasks.length > 0);

    const record = await Attendance.findOneAndUpdate(
      { projectId, date: todayStr },
      { presentWorkers: workerIds, totalNeededAtTime: totalNeeded, isFlagged },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, isFlagged, record });
  } catch (err) {
    res.status(500).json({ error: "Sync failed" });
  }
};

// Ensure this name matches exactly in attendance.routes.js
exports.addWorker = async (req, res) => {
  try {
    const worker = await Worker.create({ ...req.body, addedBy: req.user.id });
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: "Failed to add worker" });
  }
};