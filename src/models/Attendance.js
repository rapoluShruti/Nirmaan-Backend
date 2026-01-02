// models/Attendance.js
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  projectId: { type: String, required: true },
  presentWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Worker" }],
  totalNeededAtTime: { type: Number, required: true },
  isFlagged: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);