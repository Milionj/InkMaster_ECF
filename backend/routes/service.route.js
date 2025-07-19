import express from 'express';
import db from '../db.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// GET - Liste des services
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id_service AS id, nom, description FROM service');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
});

// GET - Détail d’un service
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id_service AS id, nom, description FROM service WHERE id_service = ?', [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Service non trouvé' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du service' });
  }
});

// POST - Créer un service
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { nom, description } = req.body;
  try {
    await db.execute(
      'INSERT INTO service (nom, description) VALUES (?, ?)',
      [nom, description]
    );
    res.status(201).json({ message: 'Service créé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du service' });
  }
});

// PUT - Modifier un service
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { nom, description } = req.body;
  try {
    await db.execute(
      'UPDATE service SET nom = ?, description = ? WHERE id_service = ?',
      [nom, description, req.params.id]
    );
    res.json({ message: 'Service modifié' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
});

// DELETE - Supprimer un service
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM service WHERE id_service = ?', [req.params.id]);
    res.json({ message: 'Service supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;
