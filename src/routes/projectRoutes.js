// const express = require("express");
// const router = express.Router();
// const {
//   createProject,
//   getAllProjects,
//   getProjectById,
// } = require("../controllers/projectController");
// const { protect } = require("../middleware/auth.middleware");
// router.post("/", createProject);
// router.get("/", getAllProjects);
// router.get("/:id", getProjectById);
// router.get(
//   "/:projectId/assignable-supervisors",
//   protect,
//   projectController.getAssignableSupervisors
// );
// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  getAssignableSupervisors, // ✅ ADD THIS
} = require("../controllers/projectController");

const { protect } = require("../middleware/auth.middleware");

// CREATE PROJECT
router.post("/", protect, createProject);

// GET ALL PROJECTS
router.get("/", protect, getAllProjects);

// ✅ IMPORTANT: SPECIFIC ROUTE FIRST
router.get(
  "/:projectId/assignable-supervisors",
  protect,
  getAssignableSupervisors
);

// GET SINGLE PROJECT (KEEP THIS LAST)
router.get("/:id", protect, getProjectById);

module.exports = router;
