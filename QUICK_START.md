# ⚡ Quick Start - Système de Notifications IDFM

Guide ultra-rapide pour démarrer en 5 minutes.

## 🎯 Objectif

Recevoir des notifications push pour les perturbations de la ligne IDFM C01382 (Métro 12).

## 📋 En local (2 minutes)

### 1. Tester le système

```bash
# Se placer dans le répertoire
cd "test idfm"

# Lancer les tests automatiques
./test_workflow.sh
```

### 2. Voir le site web

```bash
# Démarrer le serveur
python3 -m http.server 8000

# Ouvrir dans le navigateur
# → http://localhost:8000
```

### 3. Tester les notifications

```bash
# Ouvrir la page de démo
# → http://localhost:8000/demo.html

# Suivre les instructions sur la page
```

## 🚀 Sur GitHub (5 minutes)

### Étape 1: Créer le repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### Étape 2: Push sur GitHub

1. Créer un nouveau repo sur github.com
2. Copier les commandes affichées:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Étape 3: Configurer

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**:
   - Name: `IDFM_API_KEY`
   - Value: `PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk`

### Étape 4: Activer GitHub Pages

1. **Settings** → **Pages**
2. Source: **main** / **root**
3. Save

### Étape 5: Tester

1. **Actions** → Lancer le workflow manuellement
2. Ouvrir l'URL GitHub Pages
3. Activer les notifications

## ✅ C'est tout !

Vous recevrez maintenant des notifications à chaque nouvelle perturbation.

---

## 📚 Pour aller plus loin

- [README.md](README.md) - Documentation complète
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guide de déploiement détaillé
- [LOCAL_TESTING.md](LOCAL_TESTING.md) - Guide de tests complet
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Récapitulatif du projet

## 🆘 Besoin d'aide ?

### Le script ne fonctionne pas

```bash
# Installer les dépendances
pip3 install requests

# Tester l'API
python3 test-api-idfm.py
```

### Les notifications ne s'affichent pas

1. Vérifier les permissions dans les paramètres du navigateur
2. Utiliser Chrome ou Firefox (recommandé)
3. Ouvrir la console DevTools (F12) pour voir les erreurs

### Le site ne se charge pas

1. Vérifier que le serveur est lancé: `python3 -m http.server 8000`
2. Aller sur http://localhost:8000 (pas file://)
3. Vider le cache du navigateur (Ctrl+Shift+R)

## 🎬 Commandes utiles

```bash
# Tests complets
./test_workflow.sh

# Vérifier les perturbations
python3 check_disruptions.py

# Réinitialiser le système
./reset.sh

# Démarrer le serveur web
python3 -m http.server 8000

# Voir les données
cat data/disruptions.json | python3 -m json.tool
```

## 🎯 Vérification rapide

Après installation, vérifier que:

- [ ] `./test_workflow.sh` → ✅ Tous les tests passent
- [ ] http://localhost:8000 → ✅ Site s'affiche
- [ ] http://localhost:8000/demo.html → ✅ Page de démo fonctionne
- [ ] Notifications activées → ✅ Notification de test apparaît
- [ ] `data/disruptions.json` → ✅ Contient des perturbations
- [ ] Console DevTools → ✅ Aucune erreur rouge

Si toutes les cases sont cochées, le système fonctionne ! 🎉

---

**Temps estimé**: 2 minutes local, 5 minutes GitHub
**Difficulté**: Facile 🟢
**Support**: Chrome, Firefox, Edge
