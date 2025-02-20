const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

// Import middlewares
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Debugging the imports to ensure proper function
console.log("createAppointment:", createAppointment);
console.log("authMiddleware:", authMiddleware);
console.log("adminMiddleware:", adminMiddleware);

// Protected routes
router.post("/", authMiddleware, createAppointment); // Protected route for creating an appointment
router.get("/", authMiddleware, getAppointments); // Protected route for getting appointments
router.get("/:id", authMiddleware, getAppointmentById); // Protected route for fetching an appointment by ID
router.put("/:id", authMiddleware, updateAppointment); // Protected route for updating an appointment
router.delete("/:id", authMiddleware, deleteAppointment); // Protected route for deleting an appointment

// Admin-only route for fetching all appointments
router.get("/admin/all", authMiddleware, adminMiddleware, getAppointments);

module.exports = router;
