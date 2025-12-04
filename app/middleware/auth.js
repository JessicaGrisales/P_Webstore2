const jwt = require("jsonwebtoken");

// Récupération du secret JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware d'authentification
exports.checkAuth = (req, res, next) => {
  // 1. Récupération du jeton
  const authHeader = req.headers.authorization;

  // Vérification de l'existence du jeton (doit être au format "Bearer [TOKEN]")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Accès non autorisé. Jeton manquant." });
  }

  const token = authHeader.split(" ")[1]; // Extraction du jeton

  // 2. Vérification du jeton
  try {
    // Décode le jeton et vérifie sa signature et son expiration
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Stocke les données de l'utilisateur décodées dans la requête pour usage futur
    req.userData = {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
    };

    // 3. Le jeton est valide, passe à la prochaine fonction (le contrôleur)
    next();
  } catch (error) {
    // Jeton invalide ou expiré
    return res.status(401).json({ error: "Jeton invalide ou expiré." });
  }
};

// Middleware d'autorisation par RÔLE
exports.checkRole = (allowedRoles) => (req, res, next) => {
  // Vérifie si la requête a déjà été traitée par checkAuth (req.userData doit exister)
  if (!req.userData) {
    // En théorie, checkAuth devrait s'être exécuté avant, mais c'est une sécurité
    return res.status(403).json({
      error: "Erreur d’autorisation : Données utilisateur non disponibles.",
    });
  }

  // Vérification si le rôle de l'utilisateur décodé est dans la liste des rôles autorisés
  if (allowedRoles.includes(req.userData.role)) {
    // Rôle autorisé, on continue
    next();
  } else {
    // Rôle non autorisé
    return res
      .status(403)
      .json({ error: "Accès interdit : Rôle insuffisant." });
  }
};
