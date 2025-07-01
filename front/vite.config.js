// importer la fonction pour definir la configuration Vite
import { defineConfig } from 'vite'
// Plugin officiel pour suppoorter React (JSX, HMR..)
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configuration du server Vite de developpement

  server: {
    proxy: {
      // Toute requète frontend commençant par '/api' sera redirigée 

      '/api':  {
        target: 'http://localhost:3001', // Backend express qui tourne sur le port 3001

        changeOrigin : true, // changer l'en-tete 'origin' pour éviter les erreurs CORS
        rewrite: path => path.replace(/^\/api/,'')
        // retire `/api` du chemin envoyé au backend
        // Exemple : `/api/ping-db` devient `/ping-db` côté Express

      }
    }
  }
});
