import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';
import fetch from 'node-fetch';

const router = express.Router();
// reCAPTCHA
// Si Google renvoie success: true, la connexion continue. 
// Sinon, le backend retourne une erreur : "Captcha invalide".

const verifyCaptcha = async (token) => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    { method: 'POST' }
  );
  const data = await response.json();

  console.log("---- CAPTCHA DEBUG ----");
  console.log("Token reçu :", token);
  console.log("Clé secrète utilisée :", process.env.RECAPTCHA_SECRET);
  console.log("Réponse de Google :", data);
  console.log("------------------------");
  return data.success;
};

// ------------------ LOGIN ------------------
router.post('/login', async (req, res) => {
  const { email, password, captchaToken } = req.body;

  try {
    // 1 - Vérification du Captcha
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) return res.status(400).json({ message: 'Captcha invalide'});
    
    // 2 - Recherche de l'utilisateur dans MySQL
    const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Utilisateur introuvable' });

    const utilisateur = rows[0];
    const valid = await bcrypt.compare(password, utilisateur.mdp);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });


    const token = jwt.sign(
      { id: utilisateur.id_utilisateur, role: utilisateur.role },  //  Le rôle est encodé ici 
      process.env.JWT_SECRET || 'inkmasterSecretKey',
      { expiresIn: '2h' }
    );

    res.json({ token, role: utilisateur.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ------------------ CRUD UTILISATEURS ------------------

// GET - Liste de tous les utilisateurs (Admin uniquement)
// Route : GET utilisateurs
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id_utilisateur AS id, nom, prenom, email, role FROM utilisateur'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// POST - Créer un utilisateur (Admin uniquement)
// Route : POST /api/utilisateurs
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, hash, role]
    );
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Email déjà utilisé' });
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
});

// GET - Récupérer un utilisateur par ID (Admin uniquement)
// Route : GET /api/utilisateurs/:id
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id_utilisateur AS id, nom, prenom, email, role FROM utilisateur WHERE id_utilisateur = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT - Modifier un utilisateur (Admin uniquement)
// Route : PUT /api/utilisateurs/:id
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { nom, prenom, email, role } = req.body;

  try {
    await db.execute(
      'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, role = ? WHERE id_utilisateur = ?',
      [nom, prenom, email, role, req.params.id]
    );
    res.json({ message: 'Utilisateur modifié' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
});

// DELETE - Supprimer un utilisateur (Admin uniquement)
// Route : DELETE /api/utilisateurs/:id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM utilisateur WHERE id_utilisateur = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// ------------------ TATOUAGES D'UN ARTISTE ------------------

// GET - Récupérer les tatouages d’un artiste spécifique
// Route : GET /api/utilisateurs/:id/tatouages
router.get('/:id/tatouages', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      'SELECT id_tatouage, titre, image, description FROM tatouage WHERE id_utilisateur = ?',
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tatouages' });
  }
});

// ------------------ ADMIN INIT (optionnel) ------------------

// POST - Créer un admin par défaut si besoin
// Route : POST /api/utilisateurs/admin/init
router.post('/admin/init', async (req, res) => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', 'Principal', 'admin@inkmaster.com', hash, 'admin']
    );
    res.status(201).json({ message: 'Admin initialisé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'admin' });
  }
});

export default router;
