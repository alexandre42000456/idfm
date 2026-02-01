#!/bin/bash
# Script de test pour simuler le workflow complet

set -e

echo "🧪 Test du workflow IDFM Notifications"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Vérifier les dépendances Python
echo "1️⃣  Vérification des dépendances Python..."
if pip3 show requests > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} requests installé"
else
    echo -e "${RED}✗${NC} requests non installé. Installation..."
    pip3 install -r requirements.txt
fi
echo ""

# Test 2: Exécuter le script de détection
echo "2️⃣  Exécution du script de détection..."
python3 check_disruptions.py
echo ""

# Test 3: Vérifier les fichiers générés
echo "3️⃣  Vérification des fichiers générés..."
if [ -f "data/disruptions.json" ]; then
    echo -e "${GREEN}✓${NC} data/disruptions.json créé"
    disruption_count=$(python3 -c "import json; print(json.load(open('data/disruptions.json'))['disruptionCount'])")
    echo "   Nombre de perturbations: $disruption_count"
else
    echo -e "${RED}✗${NC} data/disruptions.json manquant"
    exit 1
fi

if [ -f "data/state.json" ]; then
    echo -e "${GREEN}✓${NC} data/state.json créé"
else
    echo -e "${RED}✗${NC} data/state.json manquant"
    exit 1
fi
echo ""

# Test 4: Vérifier la structure du JSON
echo "4️⃣  Vérification de la structure JSON..."
python3 << EOF
import json
import sys

try:
    with open('data/disruptions.json', 'r') as f:
        data = json.load(f)

    required_keys = ['lastCheck', 'hasNewDisruptions', 'disruptionCount', 'disruptions']
    missing_keys = [key for key in required_keys if key not in data]

    if missing_keys:
        print(f"❌ Clés manquantes: {missing_keys}")
        sys.exit(1)
    else:
        print("✓ Structure JSON valide")
        print(f"  - lastCheck: {data['lastCheck']}")
        print(f"  - hasNewDisruptions: {data['hasNewDisruptions']}")
        print(f"  - disruptionCount: {data['disruptionCount']}")
except Exception as e:
    print(f"❌ Erreur: {e}")
    sys.exit(1)
EOF
echo ""

# Test 5: Vérifier les fichiers du site web
echo "5️⃣  Vérification des fichiers du site web..."
files=("index.html" "app.js" "service-worker.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file présent"
    else
        echo -e "${RED}✗${NC} $file manquant"
        exit 1
    fi
done
echo ""

# Test 6: Vérifier le workflow GitHub Actions
echo "6️⃣  Vérification du workflow GitHub Actions..."
if [ -f ".github/workflows/check-idfm-disruptions.yml" ]; then
    echo -e "${GREEN}✓${NC} Workflow GitHub Actions présent"
else
    echo -e "${RED}✗${NC} Workflow manquant"
    exit 1
fi
echo ""

# Test 7: Simuler une deuxième exécution (pas de nouvelles perturbations)
echo "7️⃣  Simulation d'une deuxième exécution..."
python3 check_disruptions.py
has_new=$(python3 -c "import json; print(json.load(open('data/disruptions.json'))['hasNewDisruptions'])")
if [ "$has_new" = "False" ]; then
    echo -e "${GREEN}✓${NC} Aucune nouvelle perturbation détectée (comme attendu)"
else
    echo -e "${YELLOW}⚠${NC}  Nouvelles perturbations détectées (peut arriver si l'API a changé)"
fi
echo ""

# Résumé
echo "======================================"
echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo "  1. Initialiser un dépôt Git: git init"
echo "  2. Ajouter les fichiers: git add ."
echo "  3. Faire un commit: git commit -m 'Initial commit'"
echo "  4. Créer un repo GitHub et le lier"
echo "  5. Ajouter le secret IDFM_API_KEY dans GitHub"
echo "  6. Activer GitHub Pages"
echo "  7. Tester le site sur http://localhost:8000"
echo ""
