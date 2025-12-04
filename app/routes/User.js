const express = require("express");

const router = express.Router();
// 1. Importer le contrôleur pour accéder aux fonctions (register, get, etc.)
const controller = require("../controllers/UserController");
const UserController = require("../controllers/UserController");

// 2. Définir la route POST /register pour l'enregistrement
// Cette route appelle la fonction register qui a été codée dans le contrôleur.
router.post("/register", userController.register);

// Définir la route POST Login
router.post("/login", userController.login);
// Route déjà existante
router.get("/", controller.get);

module.exports = router;
