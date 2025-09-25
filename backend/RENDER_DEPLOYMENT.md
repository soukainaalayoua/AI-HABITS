# Configuration pour déploiement Render

## Variables d'environnement requises

Configurez ces variables dans Render Dashboard → Environment Variables :

### Base de données
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Authentification
```
JWT_SECRET=your-super-secret-jwt-key-here
```

### Email (Gmail)
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### OpenAI API
```
OPENAI_API_KEY=your-openai-api-key
```

### Configuration serveur
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://ai-habits-green.vercel.app
```

## Instructions de déploiement

1. Allez sur [render.com](https://render.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New +" → "Web Service"
4. Connectez votre repository GitHub
5. Sélectionnez le repository "AI-HABITS"
6. Configurez :
   - **Name**: ai-habits-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
7. Ajoutez toutes les variables d'environnement ci-dessus
8. Cliquez sur "Create Web Service"

## URL du backend

Une fois déployé, vous obtiendrez une URL comme :
`https://ai-habits-backend.onrender.com`

Cette URL sera utilisée pour configurer Vercel :
```
VITE_API_BASE_URL=https://ai-habits-backend.onrender.com/api
```
