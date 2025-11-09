import express from 'express';
import { body } from 'express-validator';
import { Timestamp } from 'firebase-admin/firestore';

import { db } from '../firebase.js';
import { validate } from '../middleware/verifyToken.js';
import { sanitizeBody } from '../middleware/sanitize.js';

const router = express.Router();

/* -------- Créer un avis (public) -------- */
router.post(
  '/avis',
  validate([
    body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
    body('message').isString().isLength({ min: 1, max: 5000 }).withMessage('Message requis'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Note 1..5'),
  ]),
  sanitizeBody(['email', 'message']),
  async (req, res) => {
    try {
      const { email, message, rating } = req.body;
      const newAvis = {
        email,
        message,
        rating: Number.isInteger(rating) ? rating : undefined,
        approved: false,
        createdAt: Timestamp.now(),
      };

      const docRef = await db.collection('avis').add(newAvis);
      return res.status(201).json({ id: docRef.id, message: 'Avis en attente de validation.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
);

/* -------- Lister les avis approuvés (public) -------- */
router.get('/avis', async (_req, res) => {
  try {
    const snap = await db
      .collection('avis')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const avis = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(avis);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router;
