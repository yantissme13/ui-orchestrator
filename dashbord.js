const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config(); // pour lire le fichier .env si tu es en local
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "http://localhost:4000";

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let donneesRecues = {};

// Proxy API vers l’orchestrateur :
app.get('/api/status', async (req, res) => {
    const response = await axios.get(`${ORCHESTRATOR_URL}/orchestrator/status`);
    res.send(response.data);
});

app.post('/api/update-stake', async (req, res) => {
    const response = await axios.post(`${ORCHESTRATOR_URL}/orchestrator/update-stake`, req.body);
    res.send(response.data);
});

app.post('/api/update-solde', async (req, res) => {
    const response = await axios.post(`${ORCHESTRATOR_URL}/orchestrator/update-solde`, req.body);
    res.send(response.data);
});

app.post('/api/toggle-bot', async (req, res) => {
    const response = await axios.post(`${ORCHESTRATOR_URL}/orchestrator/toggle-bot`, req.body);
    res.send(response.data);
});

app.listen(PORT, () => {
    console.log(`🌐 Interface disponible sur http://localhost:${PORT}`);
});


app.post('/orchestrator/update', (req, res) => {
    const data = req.body;
    donneesRecues[data.bookmaker] = data; // on sauvegarde par bookmaker
    console.log("📥 Données reçues :", data);
    res.json({ status: "success", message: "Données bien reçues ✅" });
});


app.post('/orchestrator/update-solde', (req, res) => {
    const { bookmaker, solde } = req.body;

    if (!bookmaker || typeof solde !== 'number') {
        return res.status(400).send({ error: "Paramètres invalides" });
    }

    soldeParBookmaker[bookmaker] = solde;
    console.log(`💾 Solde mis à jour pour ${bookmaker} : ${solde} €`);

    envoyerDonneesAuDashboard(bookmaker); // 🆕 envoi après mise à jour

    res.send({ message: "Solde mis à jour" });
});
