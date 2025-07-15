import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const router = express.Router(); // Initialise un mini-routeur Express

const verifyCaptcha = async (token) => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data.success;
};

// GET - Récupérer les tatouages d'un artiste spécifique
router.get('/utilisateurs/:id/tatouages', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      'SELECT id_tatouage, titre, image, description FROM tatouage WHERE id_utilisateur = ?',
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des tatouages de l\'artiste' });
  }
});



router.get('/utilisateurs', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id_utilisateur, nom, prenom, email, role FROM utilisateur'
    );
    res.set('Access-Control-Expose-Headers', 'Content-Range'); // permet à React Admin de voir l'en-tête
    res.set('Content-Range', `utilisateurs 0-${rows.length - 1}/${rows.length}`); // obligatoire pour pagination
    res.json(rows); //  Envoie les utilisateurs sous forme JSON

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route de connexion utilisateur (admin ou artiste)
router.post('/login', async (req, res) => {
  // On récupère les données envoyées par le client
  const { email, password, captchaToken } = req.body;

  try {
    //  Vérification du reCAPTCHA (protection contre les bots)
    const captchaValide = await verifyCaptcha(captchaToken);
    if (!captchaValide) {
      return res.status(400).json({ message: 'Échec CAPTCHA' });
    }

    // 🔍 Requête SQL pour chercher l'utilisateur par son email
    const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);

    //  Si aucun utilisateur n’est trouvé → erreur
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    const utilisateur = rows[0];

    //  Vérifie que le mot de passe fourni correspond au hash stocké
    const valid = await bcrypt.compare(password, utilisateur.mdp);

    //  Logs utiles pour le débogage
    console.log('🔐 Mot de passe reçu :', password);
    console.log('🔒 Hash stocké en BDD :', utilisateur.mdp);
    console.log(' Résultat bcrypt.compare :', valid);

    //  Mot de passe incorrect
    if (!valid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    //  Génère un token JWT contenant l’id et le rôle de l’utilisateur
    const token = jwt.sign(
      {
        id: utilisateur.id_utilisateur,
        role: utilisateur.role
      },
      process.env.JWT_SECRET || 'inkmasterSecretKey', // Clé secrète définie dans .env
      { expiresIn: '2h' } // Le token expirera dans 2 heures
    );

    //  Envoie les infos nécessaires au front :
    // le token (pour l’authentification) et le rôle (pour gérer les accès)
    res.json({
      message: 'Connexion réussie',
      token,
      role: utilisateur.role
    });

  } catch (err) {
    //  En cas d’erreur serveur
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// création d'un utilisateur 
router.post('/utilisateurs', verifyToken, isAdmin, async (req, res) => {
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
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur lors de la création.' });
  }
});


// création admin
router.post('/admin/init', async (req, res) => {
  try {
    const hash = await bcrypt.hash('admin123', 10);

    await db.execute(
      'INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', 'Principal', 'admin@inkmaster.com', hash, 'admin']
    );

    res.status(201).json({ message: 'Admin initialisé avec succès' });

  } catch (err) {
    console.error(' ERREUR INIT ADMIN :', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'admin' });
  }
});

//  route supprimer un utilisateur (réservé aux admin)   

router.delete('/utilisateurs/:id', verifyToken, isAdmin, async (req, res) => {
  const id = req.params .id;

  try{
    const [result] = await db.execute( 'DELETE FROM utilisateur where id_utilisateur = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'utilisateur introuvable' });
    }

    res.json({ message:' utilisateur supprimé avec succes '});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la sauvegarde' });
  }
});


//  route pour recuperer un utilisateur (Charger un utilisateur à éditer)
router.get('/utilisateurs/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id_utilisateur, nom, prenom, email, role FROM utilisateur WHERE id_utilisateur = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier un utilisateur spécifique
router.put('/utilisateurs/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params; // 	ID de la personne à modifier
  const { nom, prenom, email, role } = req.body; // 	Nouvelles données envoyées
  try {
    await db.execute(
      'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, role = ? WHERE id_utilisateur = ?',
      [nom, prenom, email, role, id]
    );
    res.json({ message: 'Utilisateur modifié avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});





export default router;

