# Diagnostic Railway CORS - Guide de vérification

## 🚨 Problème actuel

Railway utilise encore l'ancienne configuration CORS qui retourne `http://localhost:5173` au lieu de `https://ai-habit-frontend.vercel.app`.

## 🔍 Étapes de diagnostic

### 1. Vérifier le statut Railway

- Allez sur https://railway.app/dashboard
- Vérifiez que votre service est "Running" et non "Deploying"
- Regardez les logs récents

### 2. Tester les endpoints de diagnostic

#### Test Health Check

```bash
curl https://backend-ai-habits-production.up.railway.app/health
```

**Résultat attendu :**

```json
{
  "status": "OK",
  "timestamp": "2025-01-27T...",
  "environment": "production",
  "corsVersion": "v2.0"
}
```

#### Test CORS

```bash
curl -H "Origin: https://ai-habit-frontend.vercel.app" https://backend-ai-habits-production.up.railway.app/cors-test
```

**Résultat attendu :**

```json
{
  "message": "CORS test successful",
  "origin": "https://ai-habit-frontend.vercel.app",
  "timestamp": "2025-01-27T...",
  "corsVersion": "v2.0"
}
```

### 3. Vérifier les logs Railway

Dans les logs Railway, vous devriez voir :

```
Railway CORS Fixed v2.0
🔍 Request Headers Origin: https://ai-habit-frontend.vercel.app
🌐 CORS Request from: https://ai-habit-frontend.vercel.app
✅ CORS Allowed for: https://ai-habit-frontend.vercel.app
```

### 4. Si Railway n'a pas redéployé

#### Option A: Redémarrage manuel

- Dans Railway Dashboard, cliquez sur "Restart"

#### Option B: Changement de variable d'environnement

- Ajoutez/modifiez une variable d'environnement dans Railway
- Cela forcera un redéploiement

#### Option C: Migration vers Render.com

Si Railway continue à poser problème, nous pouvons migrer vers Render.com qui est plus fiable.

## 🎯 Prochaines étapes

1. **Attendez 5 minutes** après le push
2. **Testez les endpoints** ci-dessus
3. **Vérifiez les logs Railway**
4. **Si ça ne marche pas**, nous migrerons vers Render.com

## 📞 Support

Si le problème persiste après 10 minutes, nous passerons à Render.com pour un déploiement plus fiable.


