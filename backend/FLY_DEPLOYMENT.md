# Guide de déploiement Fly.io pour AI-HABITS Backend

## 1. Installation de Fly.io CLI

### Windows (PowerShell)
```powershell
# Télécharger et installer Fly.io CLI
iwr https://fly.io/install.ps1 -useb | iex
```

### Alternative Windows (Git Bash)
```bash
# Télécharger depuis GitHub
curl -L https://github.com/superfly/flyctl/releases/latest/download/flyctl_windows_x86_64.zip -o flyctl.zip
unzip flyctl.zip
mv flyctl.exe /usr/local/bin/
```

## 2. Configuration Fly.io

### Se connecter à Fly.io
```bash
fly auth login
```

### Initialiser l'application (si première fois)
```bash
fly launch --no-deploy
```

## 3. Configuration des variables d'environnement

### Variables requises
```bash
# MongoDB URI
fly secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ai-habits"

# JWT Secret
fly secrets set JWT_SECRET="votre-jwt-secret-super-securise"

# Email configuration
fly secrets set EMAIL_USER="votre-email@gmail.com"
fly secrets set EMAIL_PASS="votre-mot-de-passe-app"

# OpenAI API Key
fly secrets set OPENAI_API_KEY="sk-votre-openai-key"

# Node Environment
fly secrets set NODE_ENV="production"
```

## 4. Déploiement

### Déployer l'application
```bash
fly deploy
```

### Vérifier le statut
```bash
fly status
```

### Voir les logs
```bash
fly logs
```

## 5. Configuration du domaine

### Obtenir l'URL de l'application
```bash
fly info
```

L'URL sera : `https://ai-habits-backend.fly.dev`

## 6. Mise à jour du frontend

Mettre à jour l'URL API dans le frontend :
```javascript
// Dans frontend/src/services/api.js
const railwayURL = "https://ai-habits-backend.fly.dev/api";
```

## 7. Commandes utiles

### Redémarrer l'application
```bash
fly restart
```

### Ouvrir l'application dans le navigateur
```bash
fly open
```

### Voir les métriques
```bash
fly metrics
```

### Scale l'application
```bash
fly scale count 1
```

## 8. Dépannage

### Vérifier les logs en temps réel
```bash
fly logs -f
```

### Se connecter à l'instance
```bash
fly ssh console
```

### Voir la configuration
```bash
fly config show
```

## 9. Avantages de Fly.io

- ✅ Déploiement rapide et fiable
- ✅ Scaling automatique
- ✅ HTTPS automatique
- ✅ Monitoring intégré
- ✅ Logs en temps réel
- ✅ Rollback facile
- ✅ Variables d'environnement sécurisées
