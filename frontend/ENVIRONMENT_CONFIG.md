# Configuration des environnements AI-HABITS

## Développement local

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Production Railway (HTTP)

```env
VITE_API_BASE_URL=http://backend-ai-habits-production.up.railway.app/api
```

## Production Fly.io (HTTPS)

```env
VITE_API_BASE_URL=https://votre-backend.fly.dev/api
```

## Production Render (HTTPS)

```env
VITE_API_BASE_URL=https://votre-backend.onrender.com/api
```

## Production Heroku (HTTPS)

```env
VITE_API_BASE_URL=https://votre-backend.herokuapp.com/api
```

## Instructions pour changer l'URL :

### Pour Vercel :

1. Allez dans Vercel Dashboard → Settings → Environment Variables
2. Modifiez VITE_API_BASE_URL
3. Redéployez

### Pour GitHub Pages :

1. Modifiez le fichier .env
2. Commit et push vers GitHub
3. GitHub Pages redéploiera automatiquement

### Pour Netlify :

1. Allez dans Netlify Dashboard → Site settings → Environment variables
2. Modifiez VITE_API_BASE_URL
3. Redéployez

### Pour le développement local :

1. Modifiez le fichier .env
2. Redémarrez le serveur de développement


