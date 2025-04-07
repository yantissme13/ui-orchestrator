require('dotenv').config(); // pour lire le fichier .env si tu es en local
if (!process.env.ORCHESTRATOR_SECRET) {
  console.error("❌ ERREUR : ORCHESTRATOR_SECRET non défini dans le .env !");
  process.exit(1);
}
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "http://localhost:4000";

const axiosOrchestrator = axios.create({
  baseURL: ORCHESTRATOR_URL,
  headers: {
    'x-orchestrator-token': process.env.ORCHESTRATOR_SECRET
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 🔁 Redirection racine → page de login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Ensuite tu peux avoir les routes protégées comme :
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
let donneesRecues = {};

const config = {
  headers: {
    'x-orchestrator-token': process.env.ORCHESTRATOR_SECRET
  }
};


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("🛡️ Header Authorization reçu :", authHeader);

  if (!authHeader) {
    return res.status(401).send({ error: "Aucune autorisation fournie" });
  }

  const token = authHeader.split(" ")[1]; // format attendu : "Bearer motdepasse"

  if (token === process.env.ORCHESTRATOR_SECRET) {
	console.log("✅ Mot de passe validé, accès autorisé !");
    next(); // ✅ Autorisé, on passe à la suite
  } else {
	console.log("❌ Mot de passe invalide !");
    res.status(403).send({ error: "Mot de passe invalide" });
  }
}

app.post('/login', (req, res) => {
  const { password } = req.body;
  console.log("🔐 Tentative de login avec :", password);
  if (password === process.env.ORCHESTRATOR_SECRET) {
	console.log("✅ Login accepté !");
    res.send({ success: true });
  } else {
	console.log("❌ Login refusé : mot de passe incorrect");
    res.status(403).send({ error: "Mot de passe incorrect" });
  }
});

// 🔁 Routes proxy sécurisées
app.get('/api/status', authMiddleware, async (req, res) => {
    const response = await axiosOrchestrator.get('/orchestrator/status');
    res.send(response.data);
});

app.post('/api/update-stake', authMiddleware, async (req, res) => {
    const response = await axiosOrchestrator.post('/orchestrator/update-stake', req.body);
    res.send(response.data);
});

app.post('/api/update-solde', authMiddleware, async (req, res) => {
    const response = await axiosOrchestrator.post('/orchestrator/update-solde', req.body);
    res.send(response.data);
});

app.get('/api/last-update', authMiddleware, (req, res) => {
  res.send(donneesRecues);
});

app.post('/api/toggle-bot', authMiddleware, async (req, res) => {
    const response = await axiosOrchestrator.post('/orchestrator/toggle-bot', req.body);
    res.send(response.data);
});

// 🔁 Réception des données depuis l’orchestrateur
app.post('/orchestrator/update', (req, res) => {
  const data = req.body;
  console.log("📩 Données reçues depuis l’orchestrateur :", data);
  // Tu peux stocker les données ici si besoin, ex :
  donneesRecues = data;
  res.send({ message: "✅ Données reçues" });
});


app.listen(PORT, () => {
    console.log(`🌐 Interface disponible sur http://localhost:${PORT}`);
});
