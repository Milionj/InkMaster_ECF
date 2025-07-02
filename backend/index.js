import express from 'express';
import cors from 'cors'; // pour autoriser les apples API depuis un autre domaine (ex : react)
import dotenv from 'dotenv'; //  pour lier les variable d'environement vers un fichier .env
import db from './db.js'; // pour la co a la bdd
import utilisateurRoutes from './routes/utilisateurs.js';

dotenv.config(); //charge les variable du .env dans process.env

//initialisation de l'application Express 
const app = express();  // midlewear pour autoriser les appels cross-origin (react vers Express)
app.use(cors()); // Middleware pour permettre le parsing automatique du JSON dans les requêtes

app.use('/', utilisateurRoutes);

app.use(express.json());

import db from './db.js';
// temporairer : Vérifie que la base de données est bien accessible
app.get('/ping-db', async (req, res) => {
    const [rows] = await db.execute('SELECT NOW() AS now');

    res.json({ now: rows[0].now });
    });

   
// Lancement du serveur sur le port défini dans .env
app.listen(process.env.PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${process.env.PORT}`);
});
