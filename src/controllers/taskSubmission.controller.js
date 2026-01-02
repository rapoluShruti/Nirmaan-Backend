const Task = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");

exports.submitTaskUpdate = async (req, res) => {
  try {
    if (req.user.role !== "SUPERVISOR") {
      return res.status(403).json({ error: "Only supervisors allowed" });
    }

    const {
      taskId,
      status,
      beforePhotos,
      afterPhotos,
      blockReason,
      voiceNote,
      gpsLocation
    } = req.body;

    const task = await Task.findOne({ taskId });

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.isLocked) return res.status(400).json({ error: "Task locked" });

    if (!beforePhotos || beforePhotos.length === 0) {
      return res.status(400).json({ error: "Before photo required" });
    }

    if (status === "COMPLETED" && (!afterPhotos || afterPhotos.length === 0)) {
      return res
        .status(400)
        .json({ error: "After photo required for completion" });
    }

    const submission = await TaskSubmission.create({
      submissionId: `SUB-${Date.now()}`,
      taskId: task.taskId,
      projectId: task.projectId,
      supervisor: req.user.id,
      status,
      beforePhotos,
      afterPhotos: afterPhotos || [],
      blockReason: status === "BLOCKED" ? blockReason : "",
      voiceNote,
      gpsLocation
    });

    if (status === "IN_PROGRESS") {
      task.autoCarriedForward = true;
    }

    if (status === "COMPLETED") {
      task.isLocked = true;
      task.approvalStatus = false;
    }

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task update submitted",
      submission
    });
  } catch (err) {
    res.status(500).json({ error: "Submission failed" });
  }
};
/**
 * GET TASKS PENDING APPROVAL (MANAGER / ENGINEER)
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    if (!["MANAGER", "ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const tasks = await Task.find({
      afterPhotoUrl: { $exists: true },
      approved: false,
      isLocked: false
    })
      .populate("assignedSupervisor", "name email")
      .sort({ endDate: 1 });

    res.json({ tasks });
  } catch (err) {
    console.error("PENDING APPROVAL FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch approval tasks" });
  }
};

/**
 * APPROVE TASK
 */
exports.approveTask = async (req, res) => {
  try {
    if (!["MANAGER", "ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const task = await Task.findById(req.params.id);
    if (!task || !task.afterPhotoUrl) {
      return res.status(400).json({ error: "Task not ready for approval" });
    }

    task.approved = true;
    task.isLocked = true;
    task.status = "APPROVED";

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ error: "Approve failed" });
  }
};

/**
 * REJECT TASK (UNLOCK + ALLOW RE-UPLOAD)
 */
exports.rejectTask = async (req, res) => {
  try {
    if (!["MANAGER", "ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.afterPhotoUrl = null;
    task.status = "IN_PROGRESS";
    task.approved = false;
    task.isLocked = false;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ error: "Reject failed" });
  }
};
