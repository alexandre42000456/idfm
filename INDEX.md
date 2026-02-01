# 📑 Index du Projet IDFM Notifications

Guide de navigation pour trouver rapidement ce dont vous avez besoin.

## 🚀 Pour commencer

| Fichier | Description | Durée |
|---------|-------------|-------|
| **[QUICK_START.md](QUICK_START.md)** | Démarrage ultra-rapide en 5 minutes | 5 min |
| **[README.md](README.md)** | Documentation principale du projet | 10 min |

## 📚 Documentation complète

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Guide de déploiement sur GitHub | Avant le déploiement |
| **[LOCAL_TESTING.md](LOCAL_TESTING.md)** | Guide de tests locaux détaillé | Pour tester localement |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Récapitulatif technique complet | Pour comprendre l'architecture |

## 🌐 Fichiers Web (Site)

| Fichier | Description | Type |
|---------|-------------|------|
| **index.html** | Page principale du site | HTML |
| **app.js** | Logique client (polling, notifications) | JavaScript |
| **service-worker.js** | Service Worker pour notifications en arrière-plan | JavaScript |
| **demo.html** | Page de démonstration et tests | HTML |
| **manifest.json** | Manifest PWA pour installation | JSON |

## 🐍 Scripts Python

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| **check_disruptions.py** | Script principal de détection | Automatique (GitHub Actions) |
| **test-api-idfm.py** | Script de test de l'API IDFM | `python3 test-api-idfm.py` |

## 🔧 Scripts utilitaires

| Fichier | Description | Commande |
|---------|-------------|----------|
| **test_workflow.sh** | Tests automatiques complets | `./test_workflow.sh` |
| **verify.sh** | Vérification de l'intégrité du projet | `./verify.sh` |
| **reset.sh** | Réinitialisation du système | `./reset.sh` |

## 📊 Fichiers de données

| Fichier | Description | Format |
|---------|-------------|--------|
| **data/disruptions.json** | Perturbations actuelles + métadonnées | JSON |
| **data/state.json** | État précédent pour comparaison | JSON |

## ⚙️ Configuration

| Fichier | Description | Type |
|---------|-------------|------|
| **.github/workflows/check-idfm-disruptions.yml** | Workflow GitHub Actions | YAML |
| **requirements.txt** | Dépendances Python | Text |
| **.gitignore** | Fichiers à ignorer par Git | Text |

## 🎯 Scénarios d'utilisation

### Je veux tester le système localement

1. Lire: [QUICK_START.md](QUICK_START.md)
2. Exécuter: `./test_workflow.sh`
3. Démarrer: `python3 -m http.server 8000`
4. Ouvrir: http://localhost:8000

### Je veux déployer sur GitHub

1. Lire: [DEPLOYMENT.md](DEPLOYMENT.md) (étapes détaillées)
2. Résumé rapide dans [QUICK_START.md](QUICK_START.md)

### Je veux comprendre comment ça marche

1. Lire: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) (architecture)
2. Explorer: Les fichiers de code commentés

### Je veux tester les notifications

1. Ouvrir: http://localhost:8000/demo.html
2. Ou lire: [LOCAL_TESTING.md](LOCAL_TESTING.md) (tests détaillés)

### J'ai un problème

1. Section "Dépannage" dans [README.md](README.md)
2. Section "Problèmes courants" dans [LOCAL_TESTING.md](LOCAL_TESTING.md)
3. Section "Dépannage" dans [DEPLOYMENT.md](DEPLOYMENT.md)

### Je veux réinitialiser le système

```bash
./reset.sh
```

### Je veux vérifier que tout est en ordre

```bash
./verify.sh
```

## 📖 Ordre de lecture recommandé

### Pour débutants

1. [QUICK_START.md](QUICK_START.md) - Démarrage rapide
2. [README.md](README.md) - Vue d'ensemble
3. [demo.html](http://localhost:8000/demo.html) - Tests interactifs

### Pour développeurs

1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Architecture
2. [LOCAL_TESTING.md](LOCAL_TESTING.md) - Tests détaillés
3. Code source (check_disruptions.py, app.js, service-worker.js)

### Pour déploiement

1. [QUICK_START.md](QUICK_START.md) - Vue d'ensemble
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Étapes détaillées
3. [README.md](README.md) - Configuration finale

## 🔍 Recherche rapide

### Commandes

| Besoin | Commande |
|--------|----------|
| Tester le système | `./test_workflow.sh` |
| Vérifier l'intégrité | `./verify.sh` |
| Réinitialiser | `./reset.sh` |
| Démarrer le serveur | `python3 -m http.server 8000` |
| Tester l'API | `python3 test-api-idfm.py` |
| Vérifier les perturbations | `python3 check_disruptions.py` |
| Voir les données | `cat data/disruptions.json \| python3 -m json.tool` |

### URLs locales

| Page | URL |
|------|-----|
| Site principal | http://localhost:8000 |
| Page de démo | http://localhost:8000/demo.html |

### Secrets GitHub

| Secret | Valeur |
|--------|--------|
| IDFM_API_KEY | `PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk` |

## 📊 Statistiques du projet

- **22 fichiers** au total
- **2 scripts Python** (détection + test)
- **3 fichiers JavaScript** (app.js, service-worker.js, test-api-idfm.js)
- **2 pages HTML** (index.html, demo.html)
- **6 fichiers Markdown** (documentation)
- **3 scripts shell** (test, vérification, réinitialisation)

## 🎓 Concepts clés

| Concept | Fichier de référence |
|---------|---------------------|
| Détection de perturbations | check_disruptions.py |
| Notifications push | service-worker.js |
| Interface utilisateur | index.html + app.js |
| GitHub Actions | .github/workflows/check-idfm-disruptions.yml |
| Architecture complète | PROJECT_SUMMARY.md |

## ✅ Checklist de démarrage

- [ ] Lire QUICK_START.md
- [ ] Exécuter `./verify.sh`
- [ ] Exécuter `./test_workflow.sh`
- [ ] Démarrer le serveur local
- [ ] Tester sur http://localhost:8000
- [ ] Tester la page de démo
- [ ] Lire DEPLOYMENT.md
- [ ] Déployer sur GitHub

## 🆘 Besoin d'aide ?

1. **Problème technique**: Voir sections "Dépannage" dans README.md ou LOCAL_TESTING.md
2. **Erreur de déploiement**: Voir DEPLOYMENT.md
3. **Question d'architecture**: Voir PROJECT_SUMMARY.md
4. **Démarrage rapide**: Voir QUICK_START.md

---

**Fichiers les plus importants pour commencer**:
1. 🌟 QUICK_START.md
2. 🌟 README.md
3. 🌟 ./test_workflow.sh

**Conseil**: Commencez par exécuter `./verify.sh` pour vérifier que tout est en place !
