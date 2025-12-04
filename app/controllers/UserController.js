// 1. Imports : Base de données et Module de sécurité natif
const db = require("../db");
const crypto = require("crypto");

module.exports = {
  get: (req, res) => {
    res.send("User: Sarah Test");
  },

  register: (req, res) => {
    // 1. Récupérer les données de l'utilisateur (ATTENTION : Nécessite un middleware comme express.json() dans server.js)
    const { username, password, firstname, lastname } = req.body;

    // --- Sécurité : Hachage et Salage (avec Crypto) ---
    // 2. Créer un sel unique et sécurisé (salt)
    const salt = crypto.randomBytes(16).toString("hex");

    // 3. Générer le hachage sécurisé (hash)
    const hash = crypto
      .pbkdf2Sync(
        password,
        salt,
        1000, // Itérations (lent, donc sécurisé)
        64, // Longueur de la clé
        "sha512" // Algorithme
      )
      .toString("hex");

    // --- Insertion dans la base de données (SQL pur) ---

    const sql =
      "INSERT INTO t_users (username, password_hash, password_salt, firstname, lastname) VALUES (?, ?, ?, ?, ?)";

    // 4. Définir le tableau de valeurs correspondant aux placeholders
    const values = [username, hash, salt, firstname, lastname];

    // 5. Exécuter la requête sécurisée
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erreur SQL lors de l'enregistrement :", err);
        // Gérer le cas où le username existe déjà (code d'erreur MySQL 1062)
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({ error: "Ce nom d’utilisateur est déjà pris." });
        }
        return res
          .status(500)
          .json({ error: "Échec de l’enregistrement de l’utilisateur." });
      }

      // Succès
      res.status(201).json({
        message: "Utilisateur enregistré avec succès.",
        userId: result.insertId,
      });
    });
  },
};
