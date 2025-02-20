const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    // Ensure only admins can update user details
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "✅ User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalAppointments = await Appointment.countDocuments();

    // Get appointments by status
    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending",
    });
    const confirmedAppointments = await Appointment.countDocuments({
      status: "Confirmed",
    });
    const cancelledAppointments = await Appointment.countDocuments({
      status: "Cancelled",
    });

    // Get appointments for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      userStats: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      appointmentStats: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        cancelled: cancelledAppointments,
        today: todayAppointments,
      },
      recentAppointments,
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
};
