# Dockerfile pour AI-HABITS Backend sur Fly.io
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache dumb-init

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances (production seulement)
RUN npm ci --omit=dev && npm cache clean --force

# Copier le code source
COPY . .

# Rendre le script de démarrage exécutable
RUN chmod +x start.sh

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Changer la propriété des fichiers
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 3000

# Utiliser dumb-init pour une meilleure gestion des signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["./start.sh"]
