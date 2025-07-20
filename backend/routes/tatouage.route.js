import express from 'express';
import db from '../db.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

//  Route publique pour la galerie (vitrine)
router.get('/public', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT t.id_tatouage AS id, t.titre, t.image, t.description, 
             u.nom AS nom_artiste, u.prenom AS prenom_artiste
      FROM tatouage t
      JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des tatouages (public)' });
  }
});

//  Admin : Liste complète des tatouages avec ID artiste
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT t.id_tatouage AS id, t.titre, t.image, t.description, 
             u.nom AS nom_artiste, u.prenom AS prenom_artiste, t.id_utilisateur
      FROM tatouage t
      JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tatouages' });
  }
});

//  Admin : Détail d’un tatouage
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT t.id_tatouage AS id, t.titre, t.image, t.description, t.id_utilisateur,
             u.nom AS nom_artiste, u.prenom AS prenom_artiste
      FROM tatouage t
      JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
      WHERE t.id_tatouage = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Tatouage non trouvé' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tatouage' });
  }
});

//  Admin : Créer un tatouage
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { titre, image, description, id_utilisateur } = req.body;
  try {
    await db.execute(
      'INSERT INTO tatouage (titre, image, description, id_utilisateur) VALUES (?, ?, ?, ?)',
      [titre, image, description, id_utilisateur]
    );
    res.status(201).json({ message: 'Tatouage créé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du tatouage' });
  }
});

//  Admin : Modifier un tatouage
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { titre, image, description, id_utilisateur } = req.body;
  try {
    await db.execute(
      'UPDATE tatouage SET titre = ?, image = ?, description = ?, id_utilisateur = ? WHERE id_tatouage = ?',
      [titre, image, description, id_utilisateur, req.params.id]
    );
    res.json({ message: 'Tatouage modifié' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
});

//  Admin : Supprimer un tatouage
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM tatouage WHERE id_tatouage = ?', [req.params.id]);
    res.json({ message: 'Tatouage supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;
