// 1. Pour la base de données (tu as créé db.js à la racine)
const { register } = require("module");
const db = require("../db");

// 2. Le module natif de Node.js pour le hachage sécurisé
const crypto = require("crypto");

module.exports = {
  get: (req, res) => {
    res.send("User: Sarah Test");
  },
  //Nouvelle fonction d'enregistrement
  register: (req, res) => {
    // 1. Récupérer les données de l'utilisateur (username, password, etc.)
    const { username, password, firstname, lastname } = req.body;
    // 2. Créer un sel unique et sécurisé (salt)
    const salt = crypto.randomBytes(16).toString("hex");
    // 16 octets génèrent une chaîne hexadécimale de 32 caractères

    // crypto.pbkdf2Sync(mot_de_passe, sel, iterations, longueur_cle, algorithme)
    const hash = crypto
      .pbkdf2Sync(
        password,
        salt,
        1000, // Nombre d'itérations
        64, // Longueur de la clé dérivée (en octets)
        "sha512" // Algorithme de hachage
      )
      .toString("hex");
  },
};
