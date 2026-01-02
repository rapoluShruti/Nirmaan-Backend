
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { evaluateTaskAI } = require("../utils/aiTaskEvaluator");
const multer = require("multer");
const { deriveTaskState } = require("../utils/deriveTaskState");
const upload = multer({ dest: "uploads/" });

/**
 * =========================
 * CREATE TASK (R1–R14)
 * =========================
 */
exports.createTask = async (req, res) => {
  try {
    if (!["MANAGER", "ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      projectId,
      layoutImage,
      coordinates,
      categories,
      materialsRequired,
      isRisky,
      startDate,
      endDate,
      priority,
      assignedSupervisor,
      description,
      voiceNoteUrl,
    } = req.body;

    // R1
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // R3
    if (!project.layoutImages.includes(layoutImage)) {
      return res.status(400).json({ error: "Invalid layout image" });
    }

    // R12
    const supervisor = await User.findById(assignedSupervisor);
    if (!supervisor || supervisor.role !== "SUPERVISOR") {
      return res.status(400).json({ error: "Invalid supervisor" });
    }

    // R6, R7
    if (!description || !voiceNoteUrl) {
      return res.status(400).json({
        error: "Description and voice note required",
      });
    }

    // CREATE TASK
    const task = await Task.create({
      taskId: `TASK-${Date.now()}`,
      projectId,
      layoutImage,
      coordinates,
      categories,
      materialsRequired,
      isRisky,
      startDate,
      endDate,
      priority,
      assignedSupervisor,
      createdBy: req.user.id,
      description,
      voiceNoteUrl,
      status: "CREATED",
    });

    // ✅ AI EVALUATION (CORRECT PLACE)
    const aiResult = evaluateTaskAI(task);
    task.aiEvaluation = aiResult;
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: "Create task failed" });
  }
};

/**
 * =========================
 * GET SUPERVISOR TASKS (R15–R16)
 * =========================
 */
// exports.getSupervisorTasks = async (req, res) => {
//   try {
//     if (req.user.role !== "SUPERVISOR") {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     const tasks = await Task.find({
//       assignedSupervisor: req.user.id,
//     }).sort({ startDate: 1 });

//     const now = new Date();

//     const result = tasks.map((t) => {
//       let derivedStatus = t.status;

//       if (!t.beforePhotoUrl && now >= t.startDate) {
//         derivedStatus = "NOT_STARTED";
//       } else if (t.beforePhotoUrl && !t.afterPhotoUrl) {
//         derivedStatus = "IN_PROGRESS";
//       } else if (t.afterPhotoUrl) {
//         derivedStatus = "COMPLETED";
//       }

//       return {
//         ...t.toObject(),
//         derivedStatus,
//         aiEvaluation: t.aiEvaluation || null,
//       };
//     });

//     res.json({ tasks: result });
//   } catch (err) {
//     console.error("FETCH TASKS ERROR:", err);
//     res.status(500).json({ error: "Fetch failed" });
//   }
// };

exports.getSupervisorTasks = async (req, res) => {
  if (req.user.role !== "SUPERVISOR") {
    return res.status(403).json({ error: "Access denied" });
  }

  const tasks = await Task.find({
    assignedSupervisor: req.user.id
  });

  const enriched = tasks.map(t => ({
    ...t.toObject(),
    ...deriveTaskState(t),
    aiEvaluation: t.aiEvaluation || null
  }));

  res.json({ tasks: enriched });
};

/**
 * =========================
 * START TASK (Before Photo) – R17
 * =========================
 */
// exports.startTask = [
//   upload.single("beforePhoto"),
//   async (req, res) => {
//     try {
//       const task = await Task.findById(req.params.id);
//       if (!task) {
//         return res.status(404).json({ error: "Task not found" });
//       }

//       if (task.assignedSupervisor.toString() !== req.user.id) {
//         return res.status(403).json({ error: "Not your task" });
//       }

//       if (!req.file) {
//         return res.status(400).json({ error: "Before photo required" });
//       }

//       task.beforePhotoUrl = `/uploads/${req.file.filename}`;
//       task.status = "IN_PROGRESS";

//       await task.save();

//       res.json(task);
//     } catch (err) {
//       console.error("START TASK ERROR:", err);
//       res.status(500).json({ error: "Start failed" });
//     }
//   },
// ];
exports.startTask = [
  upload.single("beforePhoto"),
  async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.isLocked) return res.status(400).json({ error: "Task locked" });
    if (task.assignedSupervisor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your task" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Before photo required" });
    }

    task.beforePhotoUrl = `/uploads/${req.file.filename}`;
    task.status = "IN_PROGRESS";
    await task.save();

    res.json(task);
  }
];

/**
 * =========================
 * COMPLETE TASK (After Photo) – R18, R19
 * =========================
 */
// exports.completeTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }

//     if (task.assignedSupervisor.toString() !== req.user.id) {
//       return res.status(403).json({ error: "Not your task" });
//     }

//     if (!task.beforePhotoUrl) {
//       return res.status(400).json({ error: "Before photo missing" });
//     }

//     if (!req.body.afterPhotoUrl) {
//       return res.status(400).json({ error: "After photo required" });
//     }

//     task.afterPhotoUrl = req.body.afterPhotoUrl;
//     task.status = "COMPLETED";

//     await task.save();

//     res.json(task);
//   } catch (err) {
//     console.error("COMPLETE TASK ERROR:", err);
//     res.status(500).json({ error: "Complete failed" });
//   }
// };
exports.completeTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.isLocked) return res.status(400).json({ error: "Task locked" });
  if (task.assignedSupervisor.toString() !== req.user.id) {
    return res.status(403).json({ error: "Not your task" });
  }
  if (!task.beforePhotoUrl) {
    return res.status(400).json({ error: "Before photo missing" });
  }
  if (!req.body.afterPhotoUrl) {
    return res.status(400).json({ error: "After photo required" });
  }

  task.afterPhotoUrl = req.body.afterPhotoUrl;
  task.status = "COMPLETED";
  task.approved = false; // reset if re-upload
  task.isLocked = false;

  await task.save();
  res.json(task);
};

/**
 * =========================
 * GET TASKS PENDING APPROVAL (MANAGER)
 * =========================
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    if (!["MANAGER", "SITE_ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const tasks = await Task.find({
      afterPhotoUrl: { $exists: true },
      approved: false,
    })
      .populate("assignedSupervisor", "name email")
      .sort({ updatedAt: -1 });

    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
};

/**
 * =========================
 * APPROVE TASK
 * =========================
 */
exports.approveTask = async (req, res) => {
  try {
    if (!["MANAGER", "SITE_ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const task = await Task.findById(req.params.id);
    if (!task || !task.afterPhotoUrl) {
      return res.status(400).json({ error: "Invalid task" });
    }

    task.approved = true;
    task.isLocked = true;
    await task.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Approve failed" });
  }
};

/**
 * =========================
 * REJECT TASK (ALLOW RE-UPLOAD)
 * =========================
 */
exports.rejectTask = async (req, res) => {
  try {
    if (!["MANAGER", "SITE_ENGINEER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.afterPhotoUrl = null;
    task.status = "IN_PROGRESS";
    task.approved = false;

    await task.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reject failed" });
  }
};
// controllers/task.controller.js
exports.getManagerTasks = async (req, res) => {
  if (!["MANAGER", "SITE_ENGINEER"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }

  const tasks = await Task.find()
    .populate("assignedSupervisor", "name email");

  res.json({ tasks });
};
