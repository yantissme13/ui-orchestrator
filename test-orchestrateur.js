// ✅ Solution compatible Node 22+ en CommonJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const URL = "https//ui-orchestrator-production.up.railway.app/orchestrator/update";

const data = {
  bookmaker: "Unibet",
  solde: 123.45,
  stakeTotal: 89.90,
  nbParis: 5,
  gains: 34.5,
  date: new Date().toISOString()
};

fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
  .then(res => res.text())
  .then(response => {
    console.log("✅ Réponse du serveur :", response);
  })
  .catch(err => {
    console.error("❌ Erreur lors de l'envoi :", err);
  });
