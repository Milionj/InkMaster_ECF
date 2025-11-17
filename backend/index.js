import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

import avisRouter from './routes/avis.route.js';
import utilisateurRoutes from './routes/utilisateurs.js';
import tatouageRoutes from './routes/tatouage.route.js';
import serviceRoutes from './routes/service.route.js';

dotenv.config();

const app = express();

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   credentials: true
// }));

//  CORS piloté par .env (ex: CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000)
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Autorise les requêtes server-to-server ou Postman (sans origin)
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin)
      ? callback(null, true)
      : callback(new Error(`CORS not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
app.options(/.*/, cors(corsOptions)); //Express 5



app.use(express.json());

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/tatouages', tatouageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', avisRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
