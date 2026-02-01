#!/usr/bin/env python3
"""
Script de détection des perturbations IDFM
S'exécute via GitHub Actions toutes les 5 minutes
"""

import requests
import json
import os
from datetime import datetime
from pathlib import Path

# Configuration
API_KEY = os.environ.get('IDFM_API_KEY', 'PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk')
API_URL = 'https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3AC01382/'
DATA_DIR = Path('data')
DISRUPTIONS_FILE = DATA_DIR / 'disruptions.json'
STATE_FILE = DATA_DIR / 'state.json'

def load_previous_state():
    """Charge l'état précédent depuis state.json"""
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Erreur lors du chargement de l'état précédent: {e}")
            return {'disruption_ids': []}
    return {'disruption_ids': []}

def fetch_idfm_data():
    """Interroge l'API IDFM pour récupérer les perturbations"""
    headers = {
        'apikey': API_KEY,
        'Accept': 'application/json'
    }

    try:
        response = requests.get(API_URL, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur lors de la requête API: {e}")
        return None

def extract_disruptions(api_data):
    """Extrait les perturbations depuis la réponse de l'API"""
    disruptions = []

    if not api_data or 'disruptions' not in api_data:
        return disruptions

    for disruption in api_data.get('disruptions', []):
        disruption_info = {
            'id': disruption.get('id', ''),
            'severity': disruption.get('severity', {}).get('name', 'unknown'),
            'status': disruption.get('status', 'unknown'),
            'cause': disruption.get('cause', ''),
            'application_periods': disruption.get('application_periods', []),
            'messages': []
        }

        # Extraire les messages
        for message in disruption.get('messages', []):
            disruption_info['messages'].append({
                'text': message.get('text', ''),
                'channel': message.get('channel', {}).get('name', '')
            })

        disruptions.append(disruption_info)

    return disruptions

def detect_new_disruptions(current_disruptions, previous_state):
    """Détecte si de nouvelles perturbations sont apparues"""
    current_ids = {d['id'] for d in current_disruptions}
    previous_ids = set(previous_state.get('disruption_ids', []))

    new_ids = current_ids - previous_ids
    has_new = len(new_ids) > 0

    if has_new:
        print(f"🚨 {len(new_ids)} nouvelle(s) perturbation(s) détectée(s)")
        for disruption_id in new_ids:
            print(f"   - {disruption_id}")
    else:
        print("✅ Aucune nouvelle perturbation")

    return has_new, list(current_ids)

def save_disruptions(disruptions, has_new_disruptions):
    """Sauvegarde les perturbations dans disruptions.json"""
    DATA_DIR.mkdir(exist_ok=True)

    output_data = {
        'lastCheck': datetime.utcnow().isoformat() + 'Z',
        'hasNewDisruptions': has_new_disruptions,
        'disruptionCount': len(disruptions),
        'disruptions': disruptions
    }

    with open(DISRUPTIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"💾 Sauvegardé {len(disruptions)} perturbation(s) dans {DISRUPTIONS_FILE}")

def save_state(disruption_ids):
    """Sauvegarde l'état actuel dans state.json"""
    state_data = {
        'disruption_ids': disruption_ids,
        'last_update': datetime.utcnow().isoformat() + 'Z'
    }

    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state_data, f, indent=2, ensure_ascii=False)

    print(f"💾 État sauvegardé dans {STATE_FILE}")

def main():
    print(f"🔍 Vérification des perturbations IDFM - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📍 URL: {API_URL}")

    # Charger l'état précédent
    previous_state = load_previous_state()
    print(f"📚 État précédent: {len(previous_state.get('disruption_ids', []))} perturbation(s)")

    # Récupérer les données actuelles
    api_data = fetch_idfm_data()
    if api_data is None:
        print("⚠️ Impossible de récupérer les données, conservation de l'état précédent")
        return

    # Extraire les perturbations
    current_disruptions = extract_disruptions(api_data)
    print(f"📊 Perturbations actuelles: {len(current_disruptions)}")

    # Détecter les nouvelles perturbations
    has_new, current_ids = detect_new_disruptions(current_disruptions, previous_state)

    # Sauvegarder les données
    save_disruptions(current_disruptions, has_new)
    save_state(current_ids)

    print("✅ Vérification terminée")

if __name__ == '__main__':
    main()
