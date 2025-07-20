import express from 'express';
import { db } from '../firebase.js'; // 
import { verifyToken } from '../middleware/verifyToken.js';
import { Timestamp } from 'firebase-admin/firestore'; // Pour les dates Firestore

const router = express.Router();

// Enregistrer un avis (public, sans JWT)
router.post('/avis', async (req, res) => {
  try {
    const { email, message, rating } = req.body;
    const newAvis = {
      email,
      message,
      rating,
      approved: false,
      createdAt: Timestamp.now()
    };

    const docRef = await db.collection('avis').add(newAvis);

    res.status(201).json({ id: docRef.id, message: 'Avis en attente de validation.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Récupérer tous les avis approuvés (public)
router.get('/avis', async (req, res) => {
  try {
    const snapshot = await db.collection('avis').where('approved', '==', true).orderBy('createdAt', 'desc').get();

    const avis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(avis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Valider un avis (réservé à crusher@inkmaster.com)
router.patch('/avis/:id/validate', verifyToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.email !== 'crusher@inkmaster.com') {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    const avisRef = doc(db, 'avis', req.params.id);
    await updateDoc(avisRef, { approved: true });

    res.status(200).json({ message: 'Avis validé avec succès.' });
  } catch (error) {
    console.error('Erreur validation :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


export default router;
