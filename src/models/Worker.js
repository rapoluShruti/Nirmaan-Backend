// models/Worker.js
const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: String, required: true, index: true }, // Links to Task.projectId
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Worker", WorkerSchema);