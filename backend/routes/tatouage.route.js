import express from 'express';
import db from '../db.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// GET - Liste tous les tatouages avec nom et prénom de l’artiste
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT t.id_tatouage, t.titre, t.image, t.description, 
             u.nom AS nom_artiste, u.prenom AS prenom_artiste
      FROM tatouage t
      JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des tatouages' });
  }
});

// GET - Récupérer un tatouage par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT t.id_tatouage, t.titre, t.image, t.description, 
             u.nom AS nom_artiste, u.prenom AS prenom_artiste
      FROM tatouage t
      JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
      WHERE t.id_tatouage = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Tatouage non trouvé' });

    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', `tatouages 0-${rows.length - 1}/${rows.length}`);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tatouage' });
  }
});

// POST - Créer un tatouage (admin uniquement)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { titre, image, description, id_utilisateur } = req.body;
  try {
    await db.execute(
      'INSERT INTO tatouage (titre, image, description, id_utilisateur) VALUES (?, ?, ?, ?)',
      [titre, image, description, id_utilisateur]
    );
    res.status(201).json({ message: 'Tatouage créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du tatouage' });
  }
});

// PUT - Modifier un tatouage (admin uniquement)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { titre, image, description, id_utilisateur } = req.body;
  try {
    await db.execute(
      'UPDATE tatouage SET titre = ?, image = ?, description = ?, id_utilisateur = ? WHERE id_tatouage = ?',
      [titre, image, description, id_utilisateur, req.params.id]
    );
    res.json({ message: 'Tatouage mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification du tatouage' });
  }
});

// DELETE - Supprimer un tatouage (admin uniquement)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM tatouage WHERE id_tatouage = ?', [req.params.id]);
    res.json({ message: 'Tatouage supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du tatouage' });
  }
});

export default router;
