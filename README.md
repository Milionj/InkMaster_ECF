
# InkMaster_ECF

Application web complète pour le salon de tatouage **InkMaster** (visiteurs, artistes, administrateur).

- **Front** : React (Vite), JSX, CSS (Tailwind/Bootstrap possibles)
- **Back** : Node.js, Express, Sequelize
- **Base de données** : MySQL (principal) + Firebase (médias)
- **Infra/outil** : Docker, GitHub Projects

## Organisation
- `/front` : application React (site public + espace connecté)
- `/backend` : API Node/Express (auth, artistes, services, rendez-vous)
- `/docker` : fichiers Docker/Docker Compose
- `/docs` : maquettes, MCD/UML, notes

## Prérequis
- Node.js 20+ et npm
- Docker / Docker Compose (optionnel pour un lancement complet)
- MySQL si vous lancez l’API hors Docker

## Installation et démarrage rapides
Front :
```bash
cd front
npm install
npm run dev        # dev server Vite (http://localhost:5173)
npm run build      # build production
npm run lint       # lint front
```

Backend :
```bash 
cd backend
npm install
npm start          # lance l'API sur http://localhost:5000
```

Lancement complet via Docker Compose (API + MySQL + phpMyAdmin + front Nginx) :
```bash
docker-compose up --build
```
- MySQL exposé sur `localhost:3307` (root/root).
- Front servi sur `http://localhost:5173`, API sur `http://localhost:5000`, phpMyAdmin sur `http://localhost:8080`.

## Variables d’environnement (ne pas les rendre publiques)
- Copier les fichiers d’exemple : `cp front/.env.example front/.env` et `cp backend/.env.example backend/.env`.
- Ne jamais committer vos `.env` réels. Les valeurs ci-dessous sont des placeholders.

Front (`front/.env`) :
```
VITE_FIREBASE_API_KEY=VOTRE_CLE_API
VITE_FIREBASE_AUTH_DOMAIN=VOTRE_DOMAINE
VITE_FIREBASE_PROJECT_ID=VOTRE_ID_PROJET
VITE_FIREBASE_STORAGE_BUCKET=VOTRE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=VOTRE_SENDER_ID
VITE_FIREBASE_APP_ID=VOTRE_APP_ID
```

Backend (`backend/.env`) :
```
# DB (exemple local)
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=inkmaster
DB_PASSWORD=mot-de-passe
DB_NAME=inkmaster_db

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Auth / sécurité
JWT_SECRET=change-me
RECAPTCHA_SECRET=your-recaptcha-secret
```

## Gestion des secrets
- Remplacer toute clé ou secret déjà committé (reCAPTCHA, Firebase service account) par de nouvelles clés.
- Utiliser uniquement des valeurs d’exemple dans le dépôt public et stocker les vraies valeurs dans des `.env` non committés.
- Ajouter/laisser `.env`, `serviceAccountKey.json` et autres secrets dans `.gitignore` (déjà présent).***

## Sécurité front déjà en place
- CSP stricte dans `front/index.html` (sources limitées, frame-ancestors none, object-src none, upgrade-insecure-requests).
- reCAPTCHA v2 sur la page de login, validations fortes email/mot de passe, envoi du token au backend.
- Cookies httpOnly utilisés via `axios.withCredentials`, garde de routes (`ProtectedRoute`) et filtrage de rôle pour la modération.
- Bannière de consentement avant pose de cookie de consentement.

## Liens utiles
- [Tableau Kanban GitHub](https://github.com/Milionj/InkMaster_ECF/projects)
- [Labels GitHub](https://github.com/Milionj/InkMaster_ECF/labels)
- [Issues](https://github.com/Milionj/InkMaster_ECF/issues)

## Auteur
Projet développé par **Weber Serge**.