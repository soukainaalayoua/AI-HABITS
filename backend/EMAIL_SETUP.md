# Configuration Email pour le Formulaire de Contact

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` dans le dossier `backend/` :

```env
# Configuration Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

## Configuration Gmail

### 1. Activer l'authentification à deux facteurs

- Allez dans votre compte Google
- Sécurité → Authentification à deux facteurs
- Activez cette fonctionnalité

### 2. Générer un mot de passe d'application

- Sécurité → Mots de passe des applications
- Sélectionnez "Mail" et "Autre (nom personnalisé)"
- Entrez "AI HABITS" comme nom
- Copiez le mot de passe généré (16 caractères)

### 3. Utiliser les informations dans .env

```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=le-mot-de-passe-d-application-genere
```

## Test du formulaire

1. Démarrez le serveur backend : `npm run dev`
2. Démarrez le frontend : `npm run dev`
3. Allez sur `/contact`
4. Remplissez le formulaire
5. Vérifiez votre boîte email

## Dépannage

### Erreur "Invalid login"

- Vérifiez que l'authentification à deux facteurs est activée
- Utilisez le mot de passe d'application, pas votre mot de passe Gmail normal

### Erreur "Less secure app access"

- Cette méthode est dépréciée, utilisez les mots de passe d'application

### Email non reçu

- Vérifiez votre dossier spam
- Vérifiez que `EMAIL_USER` correspond à l'email de réception
- Vérifiez les logs du serveur pour les erreurs

