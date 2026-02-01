#!/bin/bash
# Script de vérification de l'intégrité du projet

echo "🔍 Vérification du projet IDFM Notifications"
echo "==========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (manquant)"
        ((ERRORS++))
        return 1
    fi
}

# Fonction pour vérifier l'existence d'un répertoire
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (manquant)"
        ((ERRORS++))
        return 1
    fi
}

echo "📁 Vérification des répertoires..."
check_dir ".github/workflows"
check_dir "data"
echo ""

echo "📄 Vérification des fichiers de configuration..."
check_file ".github/workflows/check-idfm-disruptions.yml"
check_file "requirements.txt"
check_file ".gitignore"
check_file "manifest.json"
echo ""

echo "🐍 Vérification des scripts Python..."
check_file "check_disruptions.py"
check_file "test-api-idfm.py"
echo ""

echo "🌐 Vérification des fichiers web..."
check_file "index.html"
check_file "app.js"
check_file "service-worker.js"
check_file "demo.html"
echo ""

echo "📊 Vérification des fichiers de données..."
check_file "data/disruptions.json"
check_file "data/state.json"
echo ""

echo "📚 Vérification de la documentation..."
check_file "README.md"
check_file "DEPLOYMENT.md"
check_file "LOCAL_TESTING.md"
check_file "PROJECT_SUMMARY.md"
check_file "QUICK_START.md"
echo ""

echo "🔧 Vérification des scripts utilitaires..."
check_file "test_workflow.sh"
check_file "reset.sh"
check_file "verify.sh"
echo ""

echo "🔍 Vérification de la syntaxe JSON..."
for json_file in data/disruptions.json data/state.json manifest.json; do
    if [ -f "$json_file" ]; then
        if python3 -m json.tool "$json_file" > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} $json_file (JSON valide)"
        else
            echo -e "${RED}✗${NC} $json_file (JSON invalide)"
            ((ERRORS++))
        fi
    fi
done
echo ""

echo "🐍 Vérification de la syntaxe Python..."
for py_file in check_disruptions.py test-api-idfm.py; do
    if [ -f "$py_file" ]; then
        if python3 -m py_compile "$py_file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $py_file (syntaxe valide)"
        else
            echo -e "${RED}✗${NC} $py_file (erreur de syntaxe)"
            ((ERRORS++))
        fi
    fi
done
echo ""

echo "📦 Vérification des dépendances Python..."
if pip3 show requests > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} requests installé"
else
    echo -e "${YELLOW}⚠${NC} requests non installé"
    ((WARNINGS++))
fi
echo ""

echo "🔑 Vérification de la configuration..."
if grep -q "PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk" check_disruptions.py; then
    echo -e "${GREEN}✓${NC} Clé API présente dans check_disruptions.py"
else
    echo -e "${YELLOW}⚠${NC} Clé API non trouvée (utilisera la variable d'environnement)"
    ((WARNINGS++))
fi
echo ""

echo "📊 Statistiques du projet..."
echo "  Fichiers Python: $(find . -name "*.py" -not -path "./env/*" | wc -l | tr -d ' ')"
echo "  Fichiers JavaScript: $(find . -name "*.js" -not -path "./env/*" | wc -l | tr -d ' ')"
echo "  Fichiers HTML: $(find . -name "*.html" | wc -l | tr -d ' ')"
echo "  Fichiers Markdown: $(find . -name "*.md" | wc -l | tr -d ' ')"
echo "  Total fichiers: $(find . -type f -not -path "./env/*" -not -name "*.pyc" | wc -l | tr -d ' ')"
echo ""

echo "==========================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Projet complet et valide !${NC}"
    echo ""
    echo "🚀 Vous pouvez maintenant:"
    echo "  1. Tester localement: ./test_workflow.sh"
    echo "  2. Démarrer le serveur: python3 -m http.server 8000"
    echo "  3. Déployer sur GitHub: voir DEPLOYMENT.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Projet complet avec $WARNINGS avertissement(s)${NC}"
    echo ""
    echo "Le projet devrait fonctionner mais vérifiez les avertissements ci-dessus."
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s) détectée(s) !${NC}"
    echo ""
    echo "Corrigez les erreurs avant de continuer."
    exit 1
fi
