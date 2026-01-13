// 1. Importe le middleware (vérifie le chemin vers le dossier middleware)
const { checkAuth } = require("../middleware/auth");

const express = require("express");

const router = express.Router();
// 1. Importer le contrôleur pour accéder aux fonctions (register, get, etc.)
const controller = require("../controllers/UserController");
const userController = require("../controllers/UserController");

// 2. Définir la route POST /register pour l'enregistrement
// Cette route appelle la fonction register qui a été codée dans le contrôleur.
router.post("/register", userController.register);

// Définir la route POST Login
router.post("/login", userController.login);
// Route déjà existante
router.get("/", controller.get);

// Route de déconnexion (JWT stateless – démo)
router.post("/logout", (req, res) => {
  res.status(200).json({
    message: "Déconnexion réussie. Le token doit être supprimé côté client.",
  });
});

// 2. Ajoute la route de profil
// On place checkAuth AVANT le contrôleur pour bloquer les gens non connectés
router.get("/profile", checkAuth, userController.getProfile);

module.exports = router;
