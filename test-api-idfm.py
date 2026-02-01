#!/usr/bin/env python3
"""
Fichier de test pour vérifier les requêtes API IDFM
Documentation: https://prim.iledefrance-mobilites.fr/marketplace
"""

import requests
import json

# ⚠️ AJOUTEZ VOTRE CLÉ API ICI
API_KEY = 'PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk'

# URL de test - ligne C01382
TEST_URL = 'https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3AC01382/'


def test_api_idfm():
    print('🚀 Test de l\'API IDFM...\n')

    # Vérification de la clé API
    if API_KEY == 'VOTRE_CLE_API_ICI':
        print('❌ Erreur: Veuillez remplacer VOTRE_CLE_API_ICI par votre clé API')
        print('   Obtenez votre clé sur: https://prim.iledefrance-mobilites.fr/')
        return

    try:
        print(f'📍 URL testée: {TEST_URL}')
        print(f'🔑 Clé API: {API_KEY[:10]}...')
        print('\n⏳ Envoi de la requête...\n')

        headers = {
            'apikey': API_KEY,
            'Accept': 'application/json'
        }

        response = requests.get(TEST_URL, headers=headers)

        print(f'📊 Statut de la réponse: {response.status_code} {response.reason}')

        if response.ok:
            data = response.json()
            print('\n✅ Succès! La connexion à l\'API fonctionne.\n')
            print('📦 Données reçues:')
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            print(f'\n❌ Erreur HTTP: {response.status_code}')
            print('Détails:', response.text)

    except requests.exceptions.RequestException as e:
        print('\n❌ Erreur lors de la requête:')
        print(str(e))
    except json.JSONDecodeError as e:
        print('\n❌ Erreur lors du décodage JSON:')
        print(str(e))
    except Exception as e:
        print('\n❌ Erreur inattendue:')
        print(str(e))


if __name__ == '__main__':
    test_api_idfm()
