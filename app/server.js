// 1. Importer et charger dotenv en premier
require("dotenv").config();

const express = require("express");

const app = express();

// Ceci permet de lire le JSON envoyé dans les requêtes POST (pour /register par exemple)
app.use(express.json());

const userRoute = require("./routes/User");
app.use("/user", userRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
