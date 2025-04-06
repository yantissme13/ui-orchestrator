import fetch from 'node-fetch'; // Installe avec `npm install node-fetch` si nécessaire

const donneesTest = {
  bookmaker: "Unibet",
  solde: 123.45,
  stakeTotal: 89.90,
  nbParis: 5,
  gains: 34.50,
  date: new Date().toISOString()
};

fetch("http://localhost:8080/orchestrator/update", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(donneesTest)
})
  .then(res => res.json())
  .then(data => {
    console.log("✅ Réponse de l'orchestrateur :", data);
  })
  .catch(err => {
    console.error("❌ Erreur lors de l'envoi :", err.message);
  });
