# 🚀 Guide de déploiement

Ce guide vous accompagne pas à pas pour déployer le système de notifications IDFM sur GitHub.

## ✅ Prérequis

- Un compte GitHub
- Git installé localement
- La clé API IDFM (actuellement: `PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk`)

## 📋 Étapes de déploiement

### 1. Initialiser le dépôt Git

```bash
cd "test idfm"
git init
git add .
git commit -m "Initial commit: IDFM notifications system"
```

### 2. Créer un repository GitHub

1. Aller sur [github.com](https://github.com)
2. Cliquer sur le **+** en haut à droite → **New repository**
3. Nom du repository: `idfm-notifications` (ou autre nom de votre choix)
4. Visibilité: **Public** (requis pour GitHub Pages gratuit)
5. **Ne pas** initialiser avec README, .gitignore ou licence
6. Cliquer sur **Create repository**

### 3. Lier le dépôt local à GitHub

Copier les commandes affichées par GitHub (section "push an existing repository"):

```bash
git remote add origin https://github.com/VOTRE_USERNAME/idfm-notifications.git
git branch -M main
git push -u origin main
```

### 4. Configurer le secret API

1. Sur GitHub, aller dans votre repository
2. Cliquer sur **Settings**
3. Dans la barre latérale, cliquer sur **Secrets and variables** → **Actions**
4. Cliquer sur **New repository secret**
5. Remplir:
   - **Name**: `IDFM_API_KEY`
   - **Secret**: `PRW2JYyz4rfOCl4gclHHoRCHgZMfeaZk`
6. Cliquer sur **Add secret**

### 5. Activer GitHub Pages

1. Toujours dans **Settings**
2. Cliquer sur **Pages** dans la barre latérale
3. Dans la section **Source**:
   - Branch: **main**
   - Folder: **/ (root)**
4. Cliquer sur **Save**
5. Attendre quelques minutes que le site soit déployé
6. L'URL de votre site apparaîtra: `https://VOTRE_USERNAME.github.io/idfm-notifications/`

### 6. Vérifier le workflow GitHub Actions

1. Aller dans l'onglet **Actions**
2. Vous devriez voir le workflow **"Check IDFM Disruptions"**
3. Pour le tester immédiatement:
   - Cliquer sur le workflow
   - Cliquer sur **Run workflow** → **Run workflow**
4. Attendre quelques secondes et vérifier que l'exécution réussit (coche verte ✓)

### 7. Vérifier les fichiers mis à jour

1. Retourner sur la page principale du repository
2. Vérifier que le dossier `data/` contient:
   - `disruptions.json`
   - `state.json`
3. Ces fichiers devraient avoir été mis à jour par le workflow

### 8. Tester le site web

1. Ouvrir l'URL GitHub Pages (obtenue à l'étape 5)
2. Le site devrait s'afficher avec l'interface de notifications
3. Cliquer sur **"Activer les notifications"**
4. Accorder les permissions quand le navigateur le demande
5. Vérifier que le statut passe à **"Notifications activées"**
6. Les perturbations actuelles devraient s'afficher

### 9. Tester les notifications

Pour tester si les notifications fonctionnent:

1. Cloner le repository localement (si pas déjà fait)
2. Modifier manuellement `data/disruptions.json`:
   ```json
   {
     "lastCheck": "2026-02-01T15:00:00Z",
     "hasNewDisruptions": true,
     "disruptionCount": 1,
     "disruptions": [...]
   }
   ```
3. Commit et push:
   ```bash
   git add data/disruptions.json
   git commit -m "Test: trigger notification"
   git push
   ```
4. Attendre 30 secondes (temps de polling du site)
5. Une notification devrait apparaître sur votre écran

## 🔧 Configuration avancée

### Changer la ligne surveillée

Pour surveiller une autre ligne IDFM:

1. Trouver l'ID de la ligne sur [IDFM Mobilités](https://prim.iledefrance-mobilites.fr/)
2. Modifier `check_disruptions.py`:
   ```python
   API_URL = 'https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3AVOTRE_ID/'
   ```
3. Commit et push les changements

### Modifier la fréquence de vérification

Dans `.github/workflows/check-idfm-disruptions.yml`:

```yaml
schedule:
  - cron: '*/10 * * * *'  # Toutes les 10 minutes au lieu de 5
```

Note: GitHub Actions ne garantit pas l'exécution exacte aux heures de pointe.

### Personnaliser les notifications

Modifier les paramètres dans `service-worker.js`:

```javascript
self.registration.showNotification(title, {
  body: body,
  icon: 'URL_DE_VOTRE_ICONE',
  badge: 'URL_DE_VOTRE_BADGE',
  vibrate: [200, 100, 200],  // Pattern de vibration
  requireInteraction: true,  // Notification persistante
});
```

## 🐛 Dépannage

### Le workflow ne s'exécute pas automatiquement

**Solution**: Les workflows cron peuvent être désactivés après 60 jours d'inactivité du repository. Pour réactiver:
- Faire un commit (même vide): `git commit --allow-empty -m "Keep workflow alive"`
- Pousser: `git push`

### Erreur "Permission denied" dans GitHub Actions

**Solution**: Activer les permissions d'écriture:
1. **Settings** → **Actions** → **General**
2. Descendre à **Workflow permissions**
3. Sélectionner **Read and write permissions**
4. Sauvegarder

### Les notifications ne s'affichent pas

**Solutions**:
1. Vérifier les permissions du navigateur (Paramètres → Notifications)
2. Vérifier que le Service Worker est enregistré (DevTools → Application → Service Workers)
3. Vérifier la console JavaScript pour des erreurs
4. Essayer dans un autre navigateur (Chrome/Firefox recommandés)

### Le site GitHub Pages affiche une erreur 404

**Solutions**:
1. Attendre 5-10 minutes après l'activation (déploiement initial)
2. Vérifier que le repository est public
3. Vérifier que `index.html` est à la racine du repository
4. Forcer un nouveau déploiement: faire un commit vide et push

## 📊 Monitoring

### Vérifier les logs GitHub Actions

1. Aller dans **Actions**
2. Cliquer sur une exécution du workflow
3. Cliquer sur le job **check-disruptions**
4. Développer les étapes pour voir les logs détaillés

### Surveiller l'utilisation de l'API

- Limite IDFM: Vérifier dans votre compte IDFM
- Fréquence actuelle: 288 requêtes/jour (toutes les 5 minutes)

### Analytics du site (optionnel)

Pour ajouter Google Analytics ou autre:
1. Créer un compte analytics
2. Ajouter le code de tracking dans `index.html` (avant `</head>`)

## 🔐 Sécurité

### Rotation de la clé API

Si vous devez changer la clé API:
1. Générer une nouvelle clé sur IDFM
2. Mettre à jour le secret `IDFM_API_KEY` dans GitHub
3. Le prochain workflow utilisera automatiquement la nouvelle clé

### Visibilité du repository

- **Public**: Nécessaire pour GitHub Pages gratuit
- **Private**: Nécessite GitHub Pro pour Pages
- Les secrets ne sont jamais exposés publiquement

## ✅ Checklist finale

- [ ] Repository créé sur GitHub
- [ ] Code pushé sur GitHub
- [ ] Secret `IDFM_API_KEY` configuré
- [ ] GitHub Pages activé
- [ ] Workflow GitHub Actions exécuté avec succès
- [ ] Site web accessible via l'URL GitHub Pages
- [ ] Notifications activées dans le navigateur
- [ ] Test de notification réussi

## 🎉 Félicitations !

Votre système de notifications IDFM est maintenant opérationnel !

Le workflow s'exécutera automatiquement toutes les 5 minutes pour vérifier les nouvelles perturbations, et vous recevrez des notifications en temps réel sur votre navigateur.

---

Pour toute question ou problème, consultez le [README.md](README.md) ou ouvrez une issue sur GitHub.
