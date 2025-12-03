// 1. Importer et charger dotenv en premier
require("dotenv").config();

const express = require("express");

const app = express();
const userRoute = require("./routes/User");
app.use("/user", userRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
