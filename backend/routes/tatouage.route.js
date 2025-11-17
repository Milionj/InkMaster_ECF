import express from 'express';
import db from '../db.js'; // encore utilisé pour les routes admin plus bas
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';
import { Tatouage, User } from '../models/index.js';

const router = express.Router();

/* -------- Route publique vitrine (Sequelize) -------- */
router.get('/public', async (_req, res) => {
  try {
    const tattoos = await Tatouage.findAll({
      include: [
        {
          model: User,
          attributes: ['nom', 'prenom'],
        },
      ],
    });

    // même format que la version SQL
    const result = tattoos.map((t) => ({
      id: t.id_tatouage,           
      titre: t.titre,
      image: t.image,
      description: t.description,
      nom_artiste: t.User?.nom,
      prenom_artiste: t.User?.prenom,
    }));

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des tatouages (public)' });
  }
});

/* -------- Admin : Liste complète des tatouages avec ID artiste (SQL classique) -------- */
router.get('/', verifyToken, isAdmin, async (_req, res) => {
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

/* -------- Admin : Détail d’un tatouage (SQL) -------- */
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT t.id_tatouage AS id, t.titre, t.image, t.description, t.id_utilisateur,
             u.nom AS nom_artiste, u.prenom AS prenom_artiste
      FROM tatouage t
      JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
      WHERE t.id_tatouage = ?
    `,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Tatouage non trouvé' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tatouage' });
  }
});

/* -------- Admin : Créer un tatouage (SQL) -------- */
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

/* -------- Admin : Modifier un tatouage (SQL) -------- */
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

/* -------- Admin : Supprimer un tatouage (SQL) -------- */
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM tatouage WHERE id_tatouage = ?', [req.params.id]);
    res.json({ message: 'Tatouage supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;
