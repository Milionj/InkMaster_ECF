import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import { verifyToken, isAdmin, validate } from '../middleware/verifyToken.js';
import { sanitizeBody, sanitizeParams } from '../middleware/sanitize.js';

import { loginValidator } from '../validators/auth.validators.js';
import {
  createUserValidator,
  updateUserValidator,
  userIdParam,
} from '../validators/user.validators.js';

const router = express.Router();

/* -------- reCAPTCHA -------- */
const verifyCaptcha = async (token) => {
  const resp = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    { method: 'POST' }
  );
  const data = await resp.json();
  // Désactiver ces logs en prod :
  console.log('---- CAPTCHA DEBUG ----');
  console.log('success:', data.success, 'score:', data.score, 'action:', data.action);
  console.log('------------------------');
  return data.success === true;
};

/* -------- LOGIN -------- */
router.post(
  '/login',
  validate(loginValidator),
  sanitizeBody(['email']),
  async (req, res) => {
    const { email, password, captchaToken } = req.body;

    try {
      // 1) Captcha
      const ok = await verifyCaptcha(captchaToken);
      if (!ok) return res.status(400).json({ message: 'Captcha invalide' });

      // 2) Récup utilisateur
      const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
      if (rows.length === 0) return res.status(401).json({ message: 'Utilisateur introuvable' });

      const utilisateur = rows[0];

      // 3) Password
      const valid = await bcrypt.compare(password, utilisateur.mdp);
      if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

      // 4) JWT
      const token = jwt.sign(
        { id: utilisateur.id_utilisateur, role: utilisateur.role },
        process.env.JWT_SECRET || 'inkmasterSecretKey',
        { expiresIn: '2h' }
      );

      // 5) Pose le token dans un cookie httpOnly
      res
        .cookie('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // en prod : HTTPS obligatoire
          sameSite: 'lax',
          maxAge: 2 * 60 * 60 * 1000, // 2h
        })
        .json({
          role: utilisateur.role, // le front n'a plus besoin du token
        });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);


/* -------- TATOUAGES d’un artiste (public côté rôle) -------- */
router.get(
  '/:id/tatouages',
  validate(userIdParam),
  sanitizeParams(['id']),
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        'SELECT id_tatouage, titre, image, description FROM tatouage WHERE id_utilisateur = ?',
        [req.params.id]
      );
      return res.json(rows);
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la récupération des tatouages' });
    }
  }
);

/* -------- ADMIN INIT (optionnel) -------- */
router.post('/admin/init', async (_req, res) => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', 'Principal', 'admin@inkmaster.com', hash, 'admin']
    );
    return res.status(201).json({ message: 'Admin initialisé' });
  } catch {
    return res.status(500).json({ message: "Erreur lors de la création de l'admin" });
  }
});

export default router;
