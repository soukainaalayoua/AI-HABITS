# Guide de déploiement Heroku pour AI-HABITS Backend

## 🚀 Étapes de déploiement sur Heroku

### 1. Créer un compte Heroku
- Allez sur https://heroku.com
- Créer un compte gratuit
- Vérifiez votre email

### 2. Installer Heroku CLI
- Téléchargez depuis : https://devcenter.heroku.com/articles/heroku-cli
- Installez-le sur votre PC Windows

### 3. Se connecter à Heroku
```bash
heroku login
```

### 4. Créer l'application Heroku
```bash
cd backend
heroku create ai-habits-backend
```

### 5. Configurer les variables d'environnement
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ai-habits"
heroku config:set JWT_SECRET="votre-jwt-secret-super-securise"
heroku config:set GMAIL_USER="salayoua@gmail.com"
heroku config:set GMAIL_PASS="votre-mot-de-passe-app-gmail"
heroku config:set OPENAI_API_KEY="sk-votre-openai-key"
```

### 6. Déployer
```bash
git push heroku master
```

### 7. Ouvrir l'application
```bash
heroku open
```

## 🔧 Commandes utiles Heroku

### Voir les logs
```bash
heroku logs --tail
```

### Redémarrer l'application
```bash
heroku restart
```

### Voir les variables d'environnement
```bash
heroku config
```

### Ouvrir l'application
```bash
heroku open
```

### Voir le statut
```bash
heroku ps
```

## 🎯 Avantages de Heroku

- ✅ **GRATUIT** : Plan gratuit généreux
- ✅ **Très fiable** : Déploiement automatique depuis GitHub
- ✅ **CORS fonctionne** : Pas de problèmes de cache
- ✅ **Logs en temps réel** : Diagnostic facile
- ✅ **Redémarrage facile** : Gestion simple
- ✅ **Support excellent** : Documentation complète

## 📋 Configuration finale

Une fois déployé, votre backend sera accessible à :
```
https://ai-habits-backend.herokuapp.com
```

Et votre frontend Vercel pointera vers cette URL.

## 🚨 Résolution des problèmes

### Si le déploiement échoue
```bash
heroku logs --tail
```

### Si l'application ne démarre pas
```bash
heroku restart
```

### Si les variables ne sont pas chargées
```bash
heroku config
```
