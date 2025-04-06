require('dotenv').config();
const axios = require('axios');

// 👉 À adapter : le nom de ta variable d’environnement Railway
const VARIABLE_NAME = 'ORCHESTRATOR_URL';

async function updateNgrokUrlInRailway() {
  try {
    // Étape 1 : Récupérer le tunnel actif
    const ngrokResp = await axios.get('http://127.0.0.1:4040/api/tunnels');
    const tunnels = ngrokResp.data.tunnels;
    const publicTunnel = tunnels.find(t => t.public_url && t.proto === 'https');

    if (!publicTunnel) {
      throw new Error("❌ Aucun tunnel HTTPS actif trouvé.");
    }

    const newUrl = publicTunnel.public_url;
    console.log(`🔗 Tunnel ngrok détecté : ${newUrl}`);

    // Étape 2 : Appeler Railway API pour mettre à jour la variable
    const RAILWAY_PROJECT_ID = process.env.RAILWAY_PROJECT_ID;
    const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;

    const response = await axios.put(
      `https://backboard.railway.app/project/${RAILWAY_PROJECT_ID}/environment/production/variables`,
      {
        [VARIABLE_NAME]: newUrl
      },
      {
        headers: {
          Authorization: `Bearer ${RAILWAY_TOKEN}`
        }
      }
    );

    console.log(`✅ URL mise à jour avec succès dans Railway : ${VARIABLE_NAME} = ${newUrl}`);
  } catch (err) {
    console.error("❌ Erreur pendant la mise à jour :", err.message);
  }
}

updateNgrokUrlInRailway();
