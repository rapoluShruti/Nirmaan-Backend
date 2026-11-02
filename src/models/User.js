const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["MANAGER", "SITE_ENGINEER", "SUPERVISOR"],
      default: "SUPERVISOR",
    },
    companyName: { type: String, trim: true },
    orgType: { type: String, enum: ["INDIVIDUAL", "BUILDER", "DEVELOPER"], default: "BUILDER" },
    gst: { type: String, uppercase: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
