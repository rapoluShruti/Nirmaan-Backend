const mongoose = require("mongoose");

const TaskSubmissionSchema = new mongoose.Schema(
  {
    submissionId: { type: String, required: true, unique: true },

    taskId: { type: String, required: true, index: true },

    projectId: { type: String, required: true },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["COMPLETED", "IN_PROGRESS", "BLOCKED"],
      required: true
    },

    beforePhotos: { type: [String], required: true },
    afterPhotos: { type: [String], default: [] },

    blockReason: { type: String, default: "" },

    voiceNote: { type: String, default: "" },

    gpsLocation: {
      lat: Number,
      lng: Number
    },

    aiVerified: { type: Boolean, default: false },

    locked: { type: Boolean, default: false },

    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskSubmission", TaskSubmissionSchema);
