// Route protéger Admin

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
// Import des middlewares
const { checkAuth, checkRole } = require("../middleware/auth");
// Route protégée : il faut être connecté ET être admin
router.get(
  "/dashboard",
  checkAuth,
  checkRole(["admin"]),
  adminController.getAdminDashboard
);

module.exports = router;
