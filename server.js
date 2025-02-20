const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");

dotenv.config();

console.log("🔍 MongoDB URI:", process.env.MONGODB_URI);
console.log("🚀 Server Port:", process.env.PORT || 5001);

// Add this before the mongoose.connect call
const connectWithRetry = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    heartbeatFrequencyMS: 2000,     // Check server health more frequently
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", {
      name: err.name,
      message: err.message,
      code: err.code,
      serverHost: err.serverHost,
    });
    
    // Log the connection string with credentials removed
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /(mongodb\+srv:\/\/)([^:]+):([^@]+)@/,
      '$1[username]:[password]@'
    );
    console.log("🔍 Attempting to connect to:", sanitizedUri);
    
    console.log("⏳ Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};


if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing! Check .env file.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing! Check .env file.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("🏥 Welcome to Dr. Atarizvi Clinic Backend!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Import routes
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Use routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const shutdown = async () => {
  try {
    console.log("🛑 Shutting down server...");
    server.close(async () => {
      console.log("✅ Server closed.");
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};


connectWithRetry();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown();
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  shutdown();
});
