import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
// Même si je ne l’utilises pas directement, l’import initialise la connexion MySQL grâce à la configuration de mon fichier

import utilisateurRoutes from './routes/utilisateurs.js';
import tatouageRoutes from './routes/tatouage.route.js';
import serviceRoutes from './routes/service.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/tatouages', tatouageRoutes);
app.use('/api/services', serviceRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${process.env.PORT}`);
});
