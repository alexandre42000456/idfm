# 🧪 Tests locaux

Guide pour tester le système de notifications IDFM localement avant le déploiement sur GitHub.

## 📋 Prérequis

- Python 3.8+
- Un navigateur moderne (Chrome ou Firefox recommandés)
- Le repo cloné localement

## 🚀 Démarrage rapide

### 1. Lancer tous les tests automatiques

```bash
./test_workflow.sh
```

Ce script vérifie:
- ✅ Les dépendances Python
- ✅ L'exécution du script de détection
- ✅ La génération des fichiers JSON
- ✅ La structure des données
- ✅ La présence de tous les fichiers
- ✅ Le workflow GitHub Actions

### 2. Démarrer le serveur web local

```bash
python3 -m http.server 8000
```

Le site sera accessible sur: http://localhost:8000

## 🔍 Tests individuels

### Test 1: Script Python de détection

**Objectif**: Vérifier que le script interroge l'API et détecte les perturbations.

```bash
python3 check_disruptions.py
```

**Résultat attendu**:
```
🔍 Vérification des perturbations IDFM - 2026-02-01 15:20:03
📍 URL: https://prim.iledefrance-mobilites.fr/...
📚 État précédent: 0 perturbation(s)
📊 Perturbations actuelles: X
🚨 X nouvelle(s) perturbation(s) détectée(s)
💾 Sauvegardé X perturbation(s) dans data/disruptions.json
✅ Vérification terminée
```

**Vérifications**:
- [ ] Les fichiers `data/disruptions.json` et `data/state.json` sont créés
- [ ] `disruptions.json` contient `hasNewDisruptions: true` la première fois
- [ ] Relancer le script → `hasNewDisruptions: false` (aucune nouvelle perturbation)

### Test 2: Structure des données JSON

**Objectif**: Vérifier que les JSON générés ont la bonne structure.

```bash
# Afficher disruptions.json formaté
cat data/disruptions.json | python3 -m json.tool

# Vérifier la présence des clés requises
python3 -c "
import json
with open('data/disruptions.json') as f:
    data = json.load(f)
    keys = ['lastCheck', 'hasNewDisruptions', 'disruptionCount', 'disruptions']
    missing = [k for k in keys if k not in data]
    if missing:
        print(f'❌ Clés manquantes: {missing}')
    else:
        print('✅ Structure JSON valide')
"
```

### Test 3: Page web et interface

**Objectif**: Tester l'affichage des perturbations.

1. Démarrer le serveur: `python3 -m http.server 8000`
2. Ouvrir http://localhost:8000
3. Vérifier:
   - [ ] La page s'affiche correctement
   - [ ] Les perturbations actuelles sont listées
   - [ ] La date de dernière vérification est affichée
   - [ ] Le bouton "Activer les notifications" est présent

### Test 4: Permissions de notifications

**Objectif**: Vérifier que les permissions sont correctement gérées.

1. Ouvrir http://localhost:8000
2. Cliquer sur "Activer les notifications"
3. Vérifier:
   - [ ] Le navigateur demande la permission
   - [ ] Après acceptation, le statut change à "Notifications activées"
   - [ ] Le point indicateur devient vert
   - [ ] Une notification de test s'affiche

### Test 5: Service Worker

**Objectif**: Vérifier l'enregistrement du Service Worker.

1. Ouvrir http://localhost:8000
2. Ouvrir DevTools (F12)
3. Aller dans **Application** → **Service Workers**
4. Vérifier:
   - [ ] Un Service Worker est enregistré
   - [ ] Son scope est correct
   - [ ] Son statut est "activated and running"

**Console**:
```
✅ Service Worker enregistré: ServiceWorkerRegistration {...}
```

### Test 6: Détection de nouvelles perturbations

**Objectif**: Simuler l'arrivée de nouvelles perturbations.

#### Méthode 1: Modification manuelle du JSON

1. Sauvegarder le contenu actuel de `data/state.json`
2. Vider le fichier: `echo '{"disruption_ids": []}' > data/state.json`
3. Relancer le script: `python3 check_disruptions.py`
4. Vérifier que `hasNewDisruptions` est à `true`
5. Ouvrir http://localhost:8000 (ou rafraîchir)
6. Une notification devrait apparaître dans les 30 secondes

#### Méthode 2: Utiliser la page de démo

1. Ouvrir http://localhost:8000/demo.html
2. Suivre les instructions sur la page
3. Tester les différents types de notifications

### Test 7: Polling du site

**Objectif**: Vérifier que le site interroge régulièrement le JSON.

1. Ouvrir http://localhost:8000
2. Ouvrir la console (F12)
3. Observer les logs toutes les 30 secondes:
   ```
   📨 Fetch disruptions...
   ✅ Disruptions loaded: X
   ```

4. Modifier `data/disruptions.json` pendant que le site est ouvert:
   ```json
   {
     "hasNewDisruptions": true,
     "lastCheck": "2026-02-01T16:00:00Z",
     ...
   }
   ```

5. Dans les 30 secondes, vérifier:
   - [ ] La console affiche "🚨 Nouvelles perturbations détectées!"
   - [ ] Une notification apparaît

### Test 8: Notification depuis le Service Worker

**Objectif**: Vérifier que le Service Worker peut afficher des notifications.

1. Ouvrir http://localhost:8000
2. Ouvrir DevTools → **Application** → **Service Workers**
3. Trouver votre Service Worker
4. Dans la section **Push**, cliquer sur "Push"
5. Ou, dans la console du Service Worker:
   ```javascript
   self.registration.showNotification('Test SW', {
     body: 'Notification depuis le Service Worker'
   });
   ```

### Test 9: Workflow GitHub Actions (simulation locale)

**Objectif**: Vérifier que le workflow fonctionnerait sur GitHub.

```bash
# Simuler les commandes du workflow
pip install -r requirements.txt
python3 check_disruptions.py
git add data/*.json
git diff --staged
```

Vérifier:
- [ ] Les dépendances s'installent sans erreur
- [ ] Le script s'exécute sans erreur
- [ ] Les fichiers JSON sont modifiés si perturbations

## 🎯 Tests end-to-end

### Scénario complet

1. **Réinitialiser l'état**:
   ```bash
   rm -rf data/
   mkdir data
   echo '{"disruption_ids": []}' > data/state.json
   ```

2. **Première exécution** (découverte):
   ```bash
   python3 check_disruptions.py
   ```
   → `hasNewDisruptions` devrait être `true`

3. **Démarrer le serveur**:
   ```bash
   python3 -m http.server 8000
   ```

4. **Ouvrir le site** (http://localhost:8000):
   - Activer les notifications
   - Vérifier que les perturbations s'affichent
   - Une notification devrait apparaître automatiquement

5. **Deuxième exécution** (pas de changement):
   ```bash
   python3 check_disruptions.py
   ```
   → `hasNewDisruptions` devrait être `false`
   → Pas de nouvelle notification

6. **Simulation de nouvelle perturbation**:
   ```bash
   # Supprimer une perturbation de state.json
   # puis relancer le script
   python3 check_disruptions.py
   ```
   → `hasNewDisruptions` repasse à `true`
   → Une nouvelle notification apparaît sur le site

## 🐛 Problèmes courants

### Les notifications ne s'affichent pas

**Causes possibles**:
1. Permissions non accordées → Vérifier dans les paramètres du navigateur
2. Service Worker non enregistré → Vérifier dans DevTools
3. Site ouvert via `file://` → Utiliser un serveur HTTP
4. Navigateur non supporté → Tester avec Chrome ou Firefox

**Solution**:
```bash
# Vérifier les permissions
python3 -c "print('Ouvrez les DevTools et tapez: Notification.permission')"

# Réenregistrer le Service Worker
# Dans la console DevTools:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  window.location.reload();
});
```

### Le script Python échoue

**Causes possibles**:
1. Module `requests` manquant
2. Clé API invalide
3. Problème réseau

**Solution**:
```bash
# Installer requests
pip3 install requests

# Tester l'API directement
python3 test-api-idfm.py

# Vérifier la connectivité
curl -H "apikey: PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk" \
  https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3AC01382/
```

### Le site ne se met pas à jour

**Causes possibles**:
1. Cache du navigateur
2. Polling désactivé
3. Fichier JSON non rechargé

**Solution**:
```bash
# Vider le cache
# Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)

# Vérifier que le polling fonctionne
# Dans la console DevTools, chercher:
# "Fetch disruptions..." toutes les 30 secondes
```

### Service Worker bloqué

**Solution**:
```javascript
// Dans la console DevTools
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
  regs.forEach(reg => {
    console.log('- Scope:', reg.scope);
    console.log('- Active:', reg.active);
  });
});

// Pour désinscrire tous les SW:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  alert('Service Workers désenregistrés. Rechargez la page.');
});
```

## ✅ Checklist de validation

Avant de déployer sur GitHub, vérifier que tous ces tests passent:

- [ ] ✅ `./test_workflow.sh` s'exécute sans erreur
- [ ] ✅ Le script Python détecte correctement les perturbations
- [ ] ✅ Les fichiers JSON sont générés avec la bonne structure
- [ ] ✅ Le site web s'affiche correctement sur http://localhost:8000
- [ ] ✅ Les permissions de notifications sont demandées et fonctionnent
- [ ] ✅ Le Service Worker est enregistré et actif
- [ ] ✅ Le polling interroge le JSON toutes les 30 secondes
- [ ] ✅ Une notification s'affiche quand `hasNewDisruptions === true`
- [ ] ✅ La page démo (demo.html) fonctionne correctement
- [ ] ✅ Aucune erreur dans la console JavaScript

## 📝 Rapports de test

Pour documenter vos tests:

```bash
# Créer un rapport
./test_workflow.sh > test_report.txt 2>&1

# Capturer les logs du script
python3 check_disruptions.py > check_log.txt 2>&1

# Vérifier la structure JSON
cat data/disruptions.json | python3 -m json.tool > disruptions_formatted.json
```

## 🎓 Apprentissage

Pour mieux comprendre le système:

1. **Lire les logs détaillés**: Toutes les étapes sont loggées
2. **Inspecter les JSON**: Comprendre la structure des données
3. **Explorer le Service Worker**: DevTools → Application
4. **Monitorer les requêtes**: DevTools → Network

---

Une fois tous les tests locaux passés, vous êtes prêt à déployer sur GitHub !

Consultez [DEPLOYMENT.md](DEPLOYMENT.md) pour les instructions de déploiement.
