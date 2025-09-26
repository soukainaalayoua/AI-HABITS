# Guide de dépannage Fly.io pour AI-HABITS Backend

## Problèmes courants et solutions

### 1. Erreur de build Docker

**Problème :** `npm ci --only=production` échoue
**Solution :** Utiliser `npm ci --omit=dev` (corrigé dans le Dockerfile)

### 2. Erreur de mémoire insuffisante

**Problème :** Application crash par manque de mémoire
**Solution :** Augmenter la mémoire à 512MB (corrigé dans fly.toml)

### 3. Erreur de port

**Problème :** Port non accessible
**Solution :** Vérifier que le port est bien exposé et configuré

### 4. Erreur de variables d'environnement

**Problème :** Variables manquantes
**Solution :** Configurer toutes les variables requises

## Commandes de diagnostic

### Vérifier le statut
```bash
fly status
```

### Voir les logs
```bash
fly logs
fly logs -f  # Suivre en temps réel
```

### Vérifier la configuration
```bash
fly config show
```

### Se connecter à l'instance
```bash
fly ssh console
```

### Redémarrer l'application
```bash
fly restart
```

## Variables d'environnement requises

```bash
# MongoDB
fly secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ai-habits"

# JWT
fly secrets set JWT_SECRET="votre-jwt-secret-super-securise"

# Email
fly secrets set EMAIL_USER="votre-email@gmail.com"
fly secrets set EMAIL_PASS="votre-mot-de-passe-app"

# OpenAI
fly secrets set OPENAI_API_KEY="sk-votre-openai-key"

# Node
fly secrets set NODE_ENV="production"
```

## Étapes de déploiement

1. **Installer Fly.io CLI**
```bash
# Windows PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

2. **Se connecter**
```bash
fly auth login
```

3. **Initialiser l'app**
```bash
fly launch --no-deploy
```

4. **Configurer les secrets**
```bash
fly secrets set MONGODB_URI="..."
fly secrets set JWT_SECRET="..."
# ... autres variables
```

5. **Déployer**
```bash
fly deploy
```

6. **Vérifier**
```bash
fly status
fly logs
```

## Dépannage spécifique

### Si l'app ne démarre pas
```bash
fly logs -f
# Chercher les erreurs dans les logs
```

### Si l'app crash au démarrage
```bash
fly ssh console
# Se connecter et vérifier les fichiers
```

### Si les variables ne sont pas chargées
```bash
fly secrets list
# Vérifier que toutes les variables sont définies
```

### Si l'app ne répond pas
```bash
fly status
# Vérifier que l'app est running
```

## Optimisations appliquées

- ✅ Dockerfile optimisé avec dumb-init
- ✅ Mémoire augmentée à 512MB
- ✅ Script de démarrage robuste
- ✅ .dockerignore complet
- ✅ Gestion des signaux améliorée
- ✅ Utilisateur non-root pour la sécurité
