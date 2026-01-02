
const Project = require("../models/Project");
const reverseGeocode = require("../utils/reverseGeocode");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const {
      projectId,
      name,
      clientEmail = "",
      startDate = new Date(),
      endDate = new Date(),
      budget,
      latitude,
      longitude,
      engineer = "Not Assigned",
      supervisor = "Not Assigned",
      typeOfConstruction = "Unknown",
      layoutImages = [],
    } = req.body;

    if (!projectId || !name || !budget) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Use provided lat/lng or defaults
    const lat = latitude || 19.07;
    const lng = longitude || 72.88;

    // Get address from reverse geocode
    const address = await reverseGeocode(lat, lng);

    const project = await Project.create({
      projectId,
      name,
      clientEmail,
      startDate,
      endDate,
      budget,
      budgetRemaining: budget,
      budgetOverflow: false,
      engineer,
      supervisor,
      typeOfConstruction,
      layoutImages,
      location: {
        latitude: lat,
        longitude: lng,
        ...address,
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PROJECTS
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PROJECT BY ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const User = require("../models/User");

exports.getAssignableSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find(
      { role: "SUPERVISOR" },
      { name: 1 }
    );

    res.status(200).json({
      supervisors
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch supervisors" });
  }
};
