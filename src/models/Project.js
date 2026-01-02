
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    clientEmail: { type: String, default: "" },
    startDate: { type: Date, default: () => new Date() },
    endDate: { type: Date, default: () => new Date() },
    budget: { type: Number, required: true },
    budgetRemaining: { type: Number, default: 0 },
    budgetOverflow: { type: Boolean, default: false },
    engineer: { type: String, default: "Not Assigned" },
    supervisor: { type: String, default: "Not Assigned" },
    typeOfConstruction: { type: String, default: "Unknown" },
    layoutImages: { type: [String], default: [] },
    location: {
      latitude: { type: Number, default: 19.07 }, // Mumbai default
      longitude: { type: Number, default: 72.88 }, // Mumbai default
      city: { type: String, default: "Mumbai" },
      state: { type: String, default: "Maharashtra" },
      country: { type: String, default: "India" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
