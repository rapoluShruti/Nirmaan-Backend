const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projectRoutes");
const app = express();
const taskRoutes = require("./routes/task.routes");

const attendanceRoutes = require("./routes/attendance.routes");
const itineraryRoutes = require("./routes/itinerary.routes");
app.use(cors());
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Auth routes
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// const projectRoutes = require('./routes/projectRoutes');

app.use('/api/projects', projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.get("/", (req, res) => {
  res.send("✅ NIRMAAN backend running");
});

module.exports = app;
