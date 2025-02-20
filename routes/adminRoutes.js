const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
} = require("../controllers/adminController");
const { auth, admin } = require("../MiddleWare/auth");


// Protected admin routes - requires both auth and admin middleware
router.get("/users", auth, admin, getUsers);
router.get("/users/:id", auth, admin, getUserById);
router.put("/users/:id", auth, admin, updateUser);
router.delete("/users/:id", auth, admin, deleteUser);
router.get("/dashboard", auth, admin, getDashboardStats);

module.exports = router;