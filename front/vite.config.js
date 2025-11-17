import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Dev proxy (mets 5000 si ton backend local tourne sur 5000)
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // Build prod optimisé
  esbuild: {
    drop: ["console", "debugger"], // nettoie le JS
  },
  build: {
    target: "es2018",
    sourcemap: false,
    chunkSizeWarningLimit: 900, // juste pour calmer l’alerte pendant la transition
    rollupOptions: {
      output: {
        // Sépare chaque lib node_modules dans son propre fichier vendor-xxx.js
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const parts = id.split("node_modules/")[1].split("/");
            const name = parts[0].startsWith("@") ? `${parts[0]}-${parts[1]}` : parts[0];
            return `vendor-${name}`;
          }
        },
      },
    },
  },
});
