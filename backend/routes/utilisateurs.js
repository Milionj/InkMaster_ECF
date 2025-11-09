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
  sanitizeBody(['email']), // pas de sanitize sur password/captcha
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

      return res.json({ token, role: utilisateur.role });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

/* -------- CRUD UTILISATEURS (admin) -------- */
router.get('/', verifyToken, isAdmin, async (_req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id_utilisateur AS id, nom, prenom, email, role FROM utilisateur'
    );
    return res.json(rows);
  } catch {
    return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.post(
  '/',
  verifyToken,
  isAdmin,
  validate(createUserValidator),
  sanitizeBody(['nom', 'prenom', 'email', 'role']),
  async (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    try {
      const hash = await bcrypt.hash(password, 10);
      await db.execute(
        'INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
        [nom, prenom, email, hash, role]
      );
      return res.status(201).json({ message: 'Utilisateur créé' });
    } catch (err) {
      if (err?.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email déjà utilisé' });
      return res.status(500).json({ message: 'Erreur serveur lors de la création' });
    }
  }
);

router.get(
  '/:id',
  verifyToken,
  isAdmin,
  validate(userIdParam),
  sanitizeParams(['id']),
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        'SELECT id_utilisateur AS id, nom, prenom, email, role FROM utilisateur WHERE id_utilisateur = ?',
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });
      return res.json(rows[0]);
    } catch {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validate(updateUserValidator),
  sanitizeParams(['id']),
  sanitizeBody(['nom', 'prenom', 'email', 'role']),
  async (req, res) => {
    const { nom, prenom, email, role } = req.body;
    try {
      await db.execute(
        'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, role = ? WHERE id_utilisateur = ?',
        [nom, prenom, email, role, req.params.id]
      );
      return res.json({ message: 'Utilisateur modifié' });
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la modification' });
    }
  }
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  validate(userIdParam),
  sanitizeParams(['id']),
  async (req, res) => {
    try {
      const [result] = await db.execute('DELETE FROM utilisateur WHERE id_utilisateur = ?', [
        req.params.id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      return res.json({ message: 'Utilisateur supprimé' });
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
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
