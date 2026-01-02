const Task = require("../models/Task");

/**
 * R33–R37
 */
exports.getDailyItinerary = async (req, res) => {
  const today = new Date();

  const tasks = await Task.find({
    projectId: req.params.projectId,
    startDate: { $lte: today },
    endDate: { $gte: today }
  });

  let required = {};
  let overdueTasks = 0;

  tasks.forEach(t => {
    t.categories.forEach(c => {
      const key = c.isCustom ? c.customName : c.name;
      required[key] = (required[key] || 0) + c.workersRequired;
    });

    if (today > t.endDate && !t.approved) overdueTasks++; // R37
  });

  res.json({
    requiredWorkers: required,
    overdueTasks,
    warnings: overdueTasks > 0 ? "TASKS_DELAYED" : null
  });
};
