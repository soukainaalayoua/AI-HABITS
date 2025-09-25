# 🤖 AI-HABITS

Une application web moderne pour suivre et améliorer vos habitudes quotidiennes avec l'aide de l'intelligence artificielle.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec vérification email
- 📧 **Emails de vérification** automatiques via Gmail
- 📊 **Dashboard interactif** avec graphiques et statistiques
- 🤖 **IA intégrée** pour suggestions personnalisées
- 📱 **Interface responsive** pour mobile et desktop
- ☁️ **Base de données cloud** MongoDB Atlas
- 🔄 **Suivi en temps réel** des habitudes

## 🚀 Technologies utilisées

### Frontend

- **React 18** avec Vite
- **Tailwind CSS** pour le design
- **Axios** pour les requêtes API
- **React Router** pour la navigation
- **Chart.js** pour les graphiques

### Backend

- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **Nodemailer** pour les emails
- **OpenAI API** pour l'IA

## 📦 Installation

### Prérequis

- Node.js (v16 ou plus récent)
- MongoDB Atlas (ou MongoDB local)
- Compte Gmail avec mot de passe d'application

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurez vos variables d'environnement
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configurez VITE_API_BASE_URL
npm run dev
```

## 🔧 Configuration

### Variables d'environnement Backend (.env)

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### Variables d'environnement Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🎯 Utilisation

1. **Inscription** : Créez un compte avec votre email
2. **Vérification** : Vérifiez votre email avec le code reçu
3. **Dashboard** : Accédez à votre tableau de bord
4. **Habitudes** : Créez et suivez vos habitudes
5. **IA** : Obtenez des conseils personnalisés

## 📊 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify-email` - Vérification email

### Habitudes

- `GET /api/habits` - Liste des habitudes
- `POST /api/habits` - Créer une habitude
- `PUT /api/habits/:id` - Modifier une habitude
- `DELETE /api/habits/:id` - Supprimer une habitude

### Suivi

- `GET /api/tracking` - Historique de suivi
- `POST /api/tracking` - Enregistrer un suivi

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ par soukaina

---

**Version** : 1.0.0  
**Dernière mise à jour** : Septembre 2025
