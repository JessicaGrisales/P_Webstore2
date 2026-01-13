// Importer et charger dotenv en premier
require("dotenv").config();

const express = require("express");
// Import pour HTTPS
const https = require("https");
// Import pour lire les fichiers
const fs = require("fs");

const app = express();

// Middleware qui permet de lire le JSON envoyé dans les requêtes POST (pour /register par exemple)
app.use(express.json());

// Routes
const userRoute = require("./routes/User");
const adminRoute = require("./routes/Admin");

app.use("/user", userRoute);
app.use("/admin", adminRoute);

// --- CONFIGURATION HTTPS ---

// 2. Charger les certificats générés avec OpenSSL
const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// 3. Lancer UNIQUEMENT le serveur sécurisé sur le port 443
const PORT = process.env.PORT || 8080;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Serveur sécurisé lancé sur https://localhost:${PORT}`);
});

const cors = require("cors");
// Autorise toutes les origines pour le développement
app.use(cors());
