const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const ORCHESTRATOR_URL = 'http://localhost:4000'; // à adapter sur Railway

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

app.use(express.json());

app.post('/orchestrator/update', (req, res) => {
  console.log("📥 Données reçues :", req.body);
  res.json({ status: "success", message: "Données bien reçues ✅" });
});
