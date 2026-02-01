// Fichier de test pour vérifier les requêtes API IDFM
// Documentation: https://prim.iledefrance-mobilites.fr/marketplace

// ⚠️ AJOUTEZ VOTRE CLÉ API ICI
const API_KEY = 'VOTRE_CLE_API_ICI';

// URL de test - ligne C01382
const TEST_URL = 'https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3AC01382/';

async function testApiIdfm() {
  console.log('🚀 Test de l\'API IDFM...\n');

  // Vérification de la clé API
  if (API_KEY === 'VOTRE_CLE_API_ICI') {
    console.error('❌ Erreur: Veuillez remplacer VOTRE_CLE_API_ICI par votre clé API');
    console.log('   Obtenez votre clé sur: https://prim.iledefrance-mobilites.fr/');
    return;
  }

  try {
    console.log(`📍 URL testée: ${TEST_URL}`);
    console.log(`🔑 Clé API: ${API_KEY.substring(0, 10)}...`);
    console.log('\n⏳ Envoi de la requête...\n');

    const response = await fetch(TEST_URL, {
      method: 'GET',
      headers: {
        'apikey': API_KEY,
        'Accept': 'application/json'
      }
    });

    console.log(`📊 Statut de la réponse: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Succès! La connexion à l\'API fonctionne.\n');
      console.log('📦 Données reçues:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error(`\n❌ Erreur HTTP: ${response.status}`);
      const errorText = await response.text();
      console.error('Détails:', errorText);
    }

  } catch (error) {
    console.error('\n❌ Erreur lors de la requête:');
    console.error(error.message);

    if (error.message.includes('fetch')) {
      console.log('\n💡 Assurez-vous d\'utiliser Node.js version 18 ou supérieure');
    }
  }
}

// Exécution du test
testApiIdfm();
