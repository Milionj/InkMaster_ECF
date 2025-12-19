# InkMaster Front

## Installation locale
1) `cd front`
2) `npm install`
3) créez `.env` (copie de `.env.example`). Pour un usage local sans backend, laissez `VITE_USE_MOCK=true`.

## Lancer en local
- `npm run dev` puis ouvrez http://localhost:5173
- Données mock (tatouages, avis, rendez-vous) affichées d’emblée si `VITE_USE_MOCK=true`.
- Comptes de démo : admin `admin@inkmaster.com` / `Password123!` ; artistes `webs|jade|crusher@inkmaster.com` (même mot de passe).

## Modes backend
- **Mock** (par défaut en dev) : aucune requête réseau, données en mémoire + `localStorage` (`inkmaster-mock-db`, `inkmaster-mock-rdv`, `inkmaster-mock-contact`).
- **Backend réel** : mettez `VITE_USE_MOCK=false` et renseignez `VITE_API_BASE_URL`.
- **Fonctions Netlify (mock serverless)** : déployées dans `netlify/functions`. Si vous voulez que le front pointe dessus, utilisez `VITE_USE_MOCK=false` et `VITE_API_BASE_URL=/.netlify/functions`.
- Firestore est utilisé seulement si `VITE_USE_MOCK=false` pour avis/rendez-vous ; sinon stockage local ou fonctions Netlify.

## Variables (.env / Netlify env)
```
VITE_USE_MOCK=true
VITE_API_BASE_URL=/.netlify/functions
VITE_FIREBASE_API_KEY=demo
VITE_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo
VITE_FIREBASE_STORAGE_BUCKET=demo
VITE_FIREBASE_MESSAGING_SENDER_ID=demo
VITE_FIREBASE_APP_ID=demo
```
- Pour utiliser les fonctions Netlify, gardez `VITE_API_BASE_URL=/.netlify/functions` et (optionnel) `VITE_USE_MOCK=false` si vous voulez consommer les handlers serverless plutôt que le mock front.

## Fonctions Netlify fournies (mock)
- `netlify/functions/tatouages.js` : GET tatouages mock (public)
- `netlify/functions/avis.js` : GET/POST/DELETE avis mock
- `netlify/functions/services.js` : CRUD simple services mock
- `netlify/functions/rendezvous.js` : GET/POST/PUT/DELETE rendez-vous mock

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
