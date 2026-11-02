require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Configure the MongoDB connection string.");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Configure a strong random signing secret.");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 NIRMAAN backend running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Failed to start NIRMAAN backend:", error.message);
  process.exit(1);
});
