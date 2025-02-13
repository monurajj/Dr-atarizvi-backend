const Appointment = require("../models/Appointment");

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    console.log("📝 Incoming Request Body:", req.body);

    const { patientName, contactInfo, date, time, purpose } = req.body;

    if (!patientName || !contactInfo || !date || !time || !purpose) {
      console.error("❌ Validation Error: Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      patientName,
      contactInfo,
      date,
      time,
      purpose,
    });

    await appointment.save();
    res.status(201).json({
      message: "✅ Appointment created successfully",
      appointment,
    });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({
      message: "Failed to create appointment",
      error: err.message,
    });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    console.error("❌ Error fetching appointment:", err);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const { patientName, contactInfo, date, time, purpose, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { patientName, contactInfo, date, time, purpose, status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "✅ Appointment updated successfully",
      appointment,
    });
  } catch (err) {
    console.error("❌ Error updating appointment:", err);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "✅ Appointment deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting appointment:", err);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
