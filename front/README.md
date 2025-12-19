# InkMaster Front

## Modes backend
- **Backend réel** : configurez `VITE_API_BASE_URL` (par défaut `http://localhost:5000`) et laissez `VITE_USE_MOCK=false`.
- **Mode mock (Netlify)** : mettez `VITE_USE_MOCK=true` pour utiliser des données locales en mémoire (persistées dans `localStorage`). Un admin de démo est disponible : `admin@inkmaster.com` / `Password123!` (artistes : `webs|jade|crusher@inkmaster.com`).

## Variables (.env / Netlify env)
```
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=demo
VITE_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo
VITE_FIREBASE_STORAGE_BUCKET=demo
VITE_FIREBASE_MESSAGING_SENDER_ID=demo
VITE_FIREBASE_APP_ID=demo
```

Sur Netlify, définissez ces variables dans Site settings > Environment variables pour voir les données mock dès le premier chargement.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
