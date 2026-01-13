const mysql = require("mysql2");

// Créer l'objet de connexion simple
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // 'db' est le nom du service dans docker-compose
  user: process.env.DB_USER, // Valeur du .env
  password: process.env.DB_PASSWORD, // Valeur du .env
  database: process.env.DB_DATABASE, // Valeur du .env
  port: process.env.DB_PORT,
  // Port interne au conteneur
});

// Tenter la connexion et gérer les erreurs
connection.connect((err) => {
  setTimeout(() => {
    if (err) {
      console.error("Erreur de connexion à la base de données : " + err.stack);
      return;
    }
    console.log("Connecté à la base de données MySQL avec succès.");
  }, 100);
});

// Exporter la connexion
module.exports = connection;
