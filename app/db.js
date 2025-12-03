const mysql = require('mysql');

// Créer l'objet de connexion simple
const connection = mysql.createConnection({
    host: // <<< Comment accèdes-tu à DB_HOST ?
    user: // <<< Comment accèdes-tu à DB_USER ?
    password: // <<< Comment accèdes-tu à DB_PASSWORD ?
    database: // <<< Comment accèdes-tu à DB_NAME ?
});

// Tenter la connexion et gérer les erreurs
connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à la base de données : ' + err.stack);
        return; 
    }
    console.log('🔗 Connecté à la base de données MySQL avec succès.');
});

// Exporter la connexion
module.exports = connection;