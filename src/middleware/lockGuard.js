const Task = require("../models/Task");

/**
 * Enforces R28
 */
module.exports = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (task?.isLocked) {
    return res.status(403).json({ error: "Task is locked and immutable" });
  }
  next();
};
