const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables at the top
dotenv.config();

console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging line

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in the .env file!");
  process.exit(1); // Exit the process
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB:", err));

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Define a basic route
app.get("/", (req, res) => {
  res.send("Welcome to Dr. Atarizvi Clinic Backend!");
});

// Routes
const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes); // Use the appointment routes

// Set the port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
