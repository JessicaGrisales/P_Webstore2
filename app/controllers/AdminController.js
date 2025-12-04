// Fonction qui va s'exécuter que s'il accompli 2 critères
// checkAuth : L'utilisateur a un jeton JWT valide et checkRole(['admin']) : Le rôle décodé dans ce jeton est bien 'admin'
exports.getAdminDashboard = (req, res) => {
  // On peut accéder aux données du jeton ici grâce au middleware
  const userRole = req.userData.role;

  res.json({
    message: "Bienvenue sur le tableau de bord Administrateur !",
    access: `Accès accordé pour le rôle : ${userRole}`,
  });
};
