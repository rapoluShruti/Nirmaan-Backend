
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    isCustom: Boolean,
    customName: String,
    workersRequired: Number,
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, unique: true },

    projectId: { type: String, required: true },
    layoutImage: { type: String, required: true },

    coordinates: {
      xPercent: Number,
      yPercent: Number,
    },

    categories: [CategorySchema],
    materialsRequired: [String],
    isRisky: Boolean,

    startDate: Date,
    endDate: Date,

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    assignedSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ⚠️ NOT required (controller enforces)
    description: String,
    voiceNoteUrl: String,

    beforePhotoUrl: String,
    afterPhotoUrl: String,

    status: {
      type: String,
      enum: ["CREATED", "NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "CREATED",
    },

    approved: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    aiEvaluation: {
  riskScore: Number,
  overdueRisk: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"]
  },
  warnings: [String],
  suggestions: [String],
  lastEvaluatedAt: Date
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
