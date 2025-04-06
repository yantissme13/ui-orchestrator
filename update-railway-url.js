import dotenv from 'dotenv';
import fetch from 'node-fetch';
import axios from 'axios';

dotenv.config();

const VARIABLE_NAME = 'ORCHESTRATOR_URL';

async function updateNgrokUrlInRailway() {
  try {
    // 🔹 1. Récupérer le tunnel ngrok
    const ngrokResp = await fetch('http://127.0.0.1:4040/api/tunnels');
    const { tunnels } = await ngrokResp.json();
    const publicTunnel = tunnels.find(t => t.public_url && t.proto === 'https');

    if (!publicTunnel) {
      throw new Error("❌ Aucun tunnel HTTPS actif trouvé.");
    }

    const newUrl = publicTunnel.public_url;
    console.log(`🔗 Tunnel ngrok détecté : ${newUrl}`);

    const projectId = process.env.RAILWAY_PROJECT_ID;
    const token = process.env.RAILWAY_TOKEN;

    // 🔹 2. Mettre à jour la variable d’environnement
    const response = await axios.patch(
      `https://backboard.railway.app/graphql/v2`,
      {
        query: `
          mutation UpdateVariable {
            environmentVariablesUpsert(input: {
              projectId: "${projectId}",
              environmentId: "production",
              variables: [
                { name: "${VARIABLE_NAME}", value: "${newUrl}" }
              ]
            }) {
              id
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`✅ URL mise à jour avec succès dans Railway : ${VARIABLE_NAME} = ${newUrl}`);
  } catch (err) {
    console.error("❌ Erreur pendant la mise à jour :", err.response?.data || err.message);
  }
}

updateNgrokUrlInRailway();
