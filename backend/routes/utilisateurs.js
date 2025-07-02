import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';


const router = express.Router(); // Initialise un mini-routeur Express


router.get('/utilisateurs', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id_utilisateur, nom, prenom, email, role FROM utilisateur'
    );
    res.json(rows); //  Envoie les utilisateurs sous forme JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.post('login', async (req, res) => {
    const { email, password } = req.body // recupere les identifiant envoyé par le client
    try {
        const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
        
        if (rows.lenght === 0 ){
            return res.status(401).json({ message: 'utilisateur introuvable'});
        }

        const utilisateur = rows[0];
        const valid = await bcrypt.compare(password, utilisateur.mdp);

        if (!valid) {ù
            return res.status(401).json({ message: 'Mot de passe incorrect'});
        }

        // Pas de JWT ici, on renvoie juste les infos utiles
        res.json({
            message: 'Connexion réussie',
        user: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        role: utilisateur.role,
        email: utilisateur.email
        }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur server'});
    }
});

router.post('/admin/create-user', verifyToken, isAdmin, async (req, res) => {

     if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }
try {
    const hash = await bcrypt.hash(password, 10); // hash sécurisé du mot de passe

     await db.execute(
      'INSERT INTO utilisateur (nom, prenom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, hash, role]
    );

res.status(201).json ({ message: 'Utilisateur crée avec succes.'});

}catch (err){
    if (err.code === 'ER_DUP_ENTRY') { 
        return res.status(409).json ({ message: 'Eamil deja utilisé'}); // empêche les doublon
    }
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création.'});
    }
});
// teste postman pour verfifier img: Teste Get recup users
export default router;

