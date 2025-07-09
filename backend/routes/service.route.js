import express from 'express';
import db from '../db.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// Lire tous les services
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM service');
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', `services 0-${rows.length - 1}/${rows.length}`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
});

// Créer un service
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { nom, description } = req.body;
  try {
    await db.execute(
      'INSERT INTO service (nom, description) VALUES (?, ?)',
      [nom, description]
    );
    res.status(201).json({ message: 'Service créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du service' });
  }
});

// Modifier un service
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { nom, description } = req.body;
  const { id } = req.params;
  try {
    await db.execute(
      'UPDATE service SET nom = ?, description = ? WHERE id_service = ?',
      [nom, description, id]
    );
    res.json({ message: 'Service mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du service' });
  }
});

// Supprimer un service
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM service WHERE id_service = ?', [id]);
    res.json({ message: 'Service supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du service' });
  }
});

export default router;
