const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/task.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const itineraryRoutes = require("./routes/itinerary.routes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server tools and local development. In production, set FRONTEND_URL.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("This origin is not allowed by the CORS policy."));
  },
  credentials: true,
}));

app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/itinerary", itineraryRoutes);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/", (req, res) => res.send("✅ NIRMAAN backend running"));

module.exports = app;
