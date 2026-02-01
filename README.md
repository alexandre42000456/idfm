# 🚇 Système de Notifications Push IDFM

Système de notifications en temps réel pour les perturbations de la ligne IDFM C01382.

## 🎯 Fonctionnalités

- ✅ Vérification automatique des perturbations toutes les 5 minutes via GitHub Actions
- ✅ Détection intelligente des nouvelles perturbations
- ✅ Notifications push navigateur en temps réel
- ✅ Interface web responsive pour consulter les perturbations
- ✅ Service Worker pour notifications en arrière-plan

## 📋 Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ GitHub Actions  │─────>│  Fichiers JSON   │<─────│  GitHub Pages   │
│  (cron: */5min) │      │  (dans le repo)  │      │  + Service SW   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                                                    │
        v                                                    v
  Interroge API IDFM                                 Notifications Push
  Détecte changements                                (API Notification)
```

## 🚀 Installation locale

### Prérequis

- Python 3.8+
- Un navigateur moderne (Chrome, Firefox, Edge)

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <votre-repo>
   cd test-idfm
   ```

2. **Installer les dépendances Python**
   ```bash
   pip install -r requirements.txt
   ```

3. **Tester le script de détection**
   ```bash
   python check_disruptions.py
   ```

4. **Lancer un serveur local**
   ```bash
   python -m http.server 8000
   ```

5. **Ouvrir le site**
   - Accéder à `http://localhost:8000`
   - Cliquer sur "Activer les notifications"
   - Accorder les permissions

## ⚙️ Configuration GitHub Actions

### 1. Ajouter la clé API comme secret

1. Aller dans **Settings** > **Secrets and variables** > **Actions**
2. Cliquer sur **New repository secret**
3. Nom: `IDFM_API_KEY`
4. Valeur: Votre clé API IDFM

### 2. Activer GitHub Pages

1. Aller dans **Settings** > **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Sauvegarder

### 3. Vérifier le workflow

1. Aller dans l'onglet **Actions**
2. Le workflow "Check IDFM Disruptions" devrait apparaître
3. Vous pouvez le déclencher manuellement avec "Run workflow"

## 📁 Structure des fichiers

```
.
├── .github/
│   └── workflows/
│       └── check-idfm-disruptions.yml   # Workflow GitHub Actions
├── data/
│   ├── disruptions.json                  # Perturbations actuelles
│   └── state.json                        # État précédent
├── check_disruptions.py                  # Script de détection
├── index.html                            # Page web principale
├── app.js                                # Logique client
├── service-worker.js                     # Service Worker
├── requirements.txt                      # Dépendances Python
└── README.md                             # Documentation
```

## 📊 Format des données

### `data/disruptions.json`
```json
{
  "lastCheck": "2026-02-01T10:30:00Z",
  "hasNewDisruptions": true,
  "disruptionCount": 2,
  "disruptions": [
    {
      "id": "disruption_123",
      "severity": "blocking",
      "status": "active",
      "messages": [
        {
          "text": "Trafic perturbé sur la ligne C01382",
          "channel": "web"
        }
      ]
    }
  ]
}
```

### `data/state.json`
```json
{
  "disruption_ids": ["disruption_123", "disruption_456"],
  "last_update": "2026-02-01T10:30:00Z"
}
```

## 🔔 Fonctionnement des notifications

1. **GitHub Actions** interroge l'API IDFM toutes les 5 minutes
2. Le script Python **compare** les perturbations actuelles avec l'état précédent
3. Si de **nouvelles perturbations** sont détectées:
   - `hasNewDisruptions` est mis à `true`
   - Les fichiers JSON sont mis à jour et commités
4. Le site web **poll** `disruptions.json` toutes les 30 secondes
5. Quand `hasNewDisruptions === true`, une **notification push** est envoyée
6. L'utilisateur reçoit la notification même si le site est fermé (selon le navigateur)

## ⚠️ Limitations

- **Fréquence**: GitHub Actions peut retarder l'exécution aux heures de pointe
- **Quota API**: 288 requêtes/jour maximum (5 minutes × 24 heures)
- **Notifications**: Nécessitent que l'utilisateur ait visité le site au moins une fois
- **Service Worker**: Peut être désactivé par certains navigateurs après inactivité prolongée
- **Safari**: Support limité des notifications en arrière-plan

## 🧪 Tests

### Test local du script Python
```bash
python check_disruptions.py
```

### Test de l'API IDFM
```bash
python test-api-idfm.py
```

### Test des notifications
1. Ouvrir le site localement
2. Activer les notifications
3. Modifier manuellement `data/disruptions.json`:
   ```json
   {
     "hasNewDisruptions": true,
     "lastCheck": "2026-02-01T12:00:00Z",
     "disruptions": [...]
   }
   ```
4. Attendre 30 secondes
5. Une notification devrait apparaître

## 🐛 Dépannage

### Les notifications ne s'affichent pas
- Vérifier que les permissions sont accordées dans les paramètres du navigateur
- Vérifier que le Service Worker est enregistré (DevTools > Application > Service Workers)
- Vérifier la console JavaScript pour des erreurs

### GitHub Actions ne s'exécute pas
- Vérifier que le workflow est activé dans l'onglet Actions
- Vérifier que le secret `IDFM_API_KEY` est configuré
- Les workflows cron peuvent être désactivés après 60 jours d'inactivité du repo

### Le site ne se met pas à jour
- Vider le cache du navigateur
- Vérifier que GitHub Pages est activé et déployé
- Attendre quelques minutes pour la propagation

## 📝 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
