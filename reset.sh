#!/bin/bash
# Script pour réinitialiser le système de notifications IDFM

echo "🔄 Réinitialisation du système IDFM Notifications"
echo "================================================"
echo ""

# Demander confirmation
read -p "⚠️  Voulez-vous réinitialiser les données ? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Opération annulée"
    exit 0
fi

echo ""
echo "1️⃣  Sauvegarde des données actuelles..."

# Créer un dossier de backup avec timestamp
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f "data/disruptions.json" ]; then
    cp data/disruptions.json "$BACKUP_DIR/"
    echo "✓ disruptions.json sauvegardé dans $BACKUP_DIR/"
fi

if [ -f "data/state.json" ]; then
    cp data/state.json "$BACKUP_DIR/"
    echo "✓ state.json sauvegardé dans $BACKUP_DIR/"
fi

echo ""
echo "2️⃣  Réinitialisation des fichiers de données..."

# Réinitialiser disruptions.json
cat > data/disruptions.json << 'EOF'
{
  "lastCheck": null,
  "hasNewDisruptions": false,
  "disruptionCount": 0,
  "disruptions": []
}
EOF
echo "✓ disruptions.json réinitialisé"

# Réinitialiser state.json
cat > data/state.json << 'EOF'
{
  "disruption_ids": [],
  "last_update": null
}
EOF
echo "✓ state.json réinitialisé"

echo ""
echo "3️⃣  Nouvelle vérification des perturbations..."
python3 check_disruptions.py

echo ""
echo "================================================"
echo "✅ Réinitialisation terminée !"
echo ""
echo "📂 Backup disponible dans: $BACKUP_DIR/"
echo ""
echo "💡 Prochaines étapes:"
echo "  - Ouvrir http://localhost:8000 pour vérifier le site"
echo "  - Exécuter ./test_workflow.sh pour tester le système"
echo ""
