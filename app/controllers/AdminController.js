const db = require("../db");
// Fonction qui va s'exécuter que s'il accompli 2 critères
// checkAuth : L'utilisateur a un jeton JWT valide et checkRole(['admin']) : Le rôle décodé dans ce jeton est bien 'admin'
exports.getAdminDashboard = (req, res) => {
  // 1. Récupérer le terme de recherche depuis l'URL (ex: /admin/dashboard?search=sarah)
  const searchTerm = req.query.search || "";

  // 2. Préparer le pattern pour SQL (le % permet de chercher "contient")
  const searchPattern = `%${searchTerm}%`;

  // 3. Requête SQL pure avec protection par placeholder (?)
  const sql =
    "SELECT id, username, role, firstname, lastname FROM t_users WHERE username LIKE ?";

  db.query(sql, [searchPattern], (err, results) => {
    if (err) {
      console.error("Erreur SQL recherche admin :", err);
      return res.status(500).json({ error: "Erreur lors de la recherche." });
    }

    // 4. Réponse avec les résultats de la base de données
    res.json({
      message: "Tableau de bord Administrateur",
      search_term: searchTerm,
      results_count: results.length,
      users: results, // Liste des utilisateurs trouvés
    });
  });
};
