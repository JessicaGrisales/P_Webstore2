// Route protéger Admin

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
// Import des middlewares
const { checkAuth, checkRole } = require("../middleware/auth");
// 1. Définition du rôle autorisé (seul 'admin' a le droit d'accéder)
router.get(
  "/dashboard",
  checkAuth, // 1. Vérifie si le jeton est valide
  checkRole(["admin"]), // 2. Vérifie si le rôle décodé est 'admin'
  adminController.getAdminDashboard
);

module.exports = router;
