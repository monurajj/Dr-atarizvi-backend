const Appointment = require("../models/Appointment");

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { patientName, date, time, purpose } = req.body;
    const appointment = new Appointment({ patientName, date, time, purpose });
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create appointment", error: err.message });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch appointments", error: err.message });
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
    res
      .status(500)
      .json({ message: "Failed to fetch appointment", error: err.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const { patientName, date, time, purpose, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { patientName, date, time, purpose, status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res
      .status(200)
      .json({ message: "Appointment updated successfully", appointment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update appointment", error: err.message });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete appointment", error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
