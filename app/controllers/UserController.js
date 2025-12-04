// 1. Imports : Base de données et Module de sécurité natif
const db = require("../db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Accès à la clé secrète, Accès au secret du .env
const JWT_SECRET = process.env.JWT_SECRET;

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
  // La fonction LOGIN (que nous venons de coder ensemble)
  login: (req, res) => {
    // 1. Récupération des données du formulaire
    const { username, password } = req.body;

    // 2. Requête SQL SELECT pour trouver l'utilisateur et récupérer hash/salt/role
    const sql =
      "SELECT id, username, password_hash, password_salt, role FROM t_users WHERE username = ?";

    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error(
          "Erreur SQL lors de la recherche de l'utilisateur :",
          err
        );
        return res.status(500).json({ error: "Erreur serveur." });
      }
      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Nom d’utilisateur ou mot de passe incorrect." });
      }

      const user = results[0];
      const { password_hash: storedHash, password_salt: storedSalt } = user;

      // 3. Hachage du mot de passe fourni avec le sel stocké
      const hashToVerify = crypto
        .pbkdf2Sync(password, storedSalt, 1000, 64, "sha512")
        .toString("hex");

      // 4. Comparaison des hachages
      if (hashToVerify !== storedHash) {
        return res
          .status(401)
          .json({ error: "Nom d’utilisateur ou mot de passe incorrect." });
      }

      // 5. Succès de la connexion : Génération du JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role, // 👈 CRUCIAL pour la gestion des rôles
        },
        JWT_SECRET, // Utilisation de la clé secrète du .env
        {
          expiresIn: "1h", // Le jeton expirera dans 1 heure (à adapter)
        }
      );

      // 6. Renvoyer le jeton au client
      res.json({
        message: "Connexion réussie.",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    });
  },
};
