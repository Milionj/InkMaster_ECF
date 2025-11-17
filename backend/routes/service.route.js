import express from 'express';
import db from '../db.js';

import { verifyToken, isAdmin, validate } from '../middleware/verifyToken.js';
import { sanitizeBody, sanitizeParams } from '../middleware/sanitize.js';
import {
  createServiceValidator,
  updateServiceValidator,
  serviceIdParam,
} from '../validators/service.validators.js';

const router = express.Router();

/* -------- Liste -------- */
router.get('/', verifyToken, isAdmin, async (_req, res) => {
  try {
    const [rows] = await db.execute('SELECT id_service AS id, nom, description FROM service');
    return res.json(rows);
  } catch {
    return res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
});

/* -------- Détail -------- */
router.get(
  '/:id',
  verifyToken,
  isAdmin,
  validate(serviceIdParam),
  sanitizeParams(['id']),
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        'SELECT id_service AS id, nom, description FROM service WHERE id_service = ?',
        [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ message: 'Service non trouvé' });
      return res.json(rows[0]);
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la récupération du service' });
    }
  }
);

/* -------- Créer -------- */
router.post(
  '/',
  verifyToken,
  isAdmin,
  validate(createServiceValidator),
  sanitizeBody(['nom', 'description']),
  async (req, res) => {
    const { nom, description } = req.body;
    try {
      await db.execute('INSERT INTO service (nom, description) VALUES (?, ?)', [nom, description]);
      return res.status(201).json({ message: 'Service créé' });
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la création du service' });
    }
  }
);

/* -------- Modifier -------- */
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validate(updateServiceValidator),
  sanitizeParams(['id']),
  sanitizeBody(['nom', 'description']),
  async (req, res) => {
    const { nom, description } = req.body;
    try {
      await db.execute('UPDATE service SET nom = ?, description = ? WHERE id_service = ?', [
        nom,
        description,
        req.params.id,
      ]);
      return res.json({ message: 'Service modifié' });
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la modification' });
    }
  }
);

/* -------- Supprimer -------- */
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  validate(serviceIdParam),
  sanitizeParams(['id']),
  async (req, res) => {
    try {
      await db.execute('DELETE FROM service WHERE id_service = ?', [req.params.id]);
      return res.json({ message: 'Service supprimé' });
    } catch {
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  }
);

export default router;
