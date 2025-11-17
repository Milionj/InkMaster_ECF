import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  query,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import './ModerationAvis.css';

export default function ModerationAvis() {
  const [avis, setAvis] = useState([]);
  const [message, setMessage] = useState('');

  // Vérifier si l'utilisateur Firebase est connecté (facultatif, pour debug)
    useEffect(() => {
    const auth = getAuth();
    console.log('Utilisateur Firebase connecté :', auth.currentUser?.email);
  }, []);

  // Fonction utilitaire : vérifier si l’avis est récent (moins de 24h)
  const isNew = (createdAt) => {
    if (!createdAt?.toDate) return false;
    const now = new Date();
    const diff = now - createdAt.toDate();
    return diff < 1000 * 60 * 60 * 24; // moins de 24 heures
  };

  // Écouter en temps réel tous les avis
  useEffect(() => {
    const q = query(collection(db, 'avis'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvis(data);
    });

    return () => unsubscribe(); // Nettoyage du listener
  }, []);

  // Supprimer un avis (désapprobation)
const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, 'avis', id));
    setMessage('❌ Avis désapprouvé et supprimé.');

    // Optionnel si on veut que le message disparaisse
    setTimeout(() => setMessage(''), 4000);
  } catch (err) {
    console.error('Erreur suppression avis :', err);
    alert("Erreur Firebase : " + err.message);
  }
};


  return (
    <div className="moderation-container">
      <h1>Modération des Avis</h1>
      {message && <p className="message">{message}</p>}

      {avis.length === 0 ? (
        <p>Aucun avis enregistré.</p>
      ) : (
        avis.map((a) => (
          <div
            key={a.id}
            className={`comment-card ${isNew(a.createdAt) ? 'new-comment' : ''}`}
          >
            <p><strong>{a.email}</strong></p>
            <p>{a.message}</p>

            {a.rating > 0 && (
              <div className="stars">
                {'★'.repeat(a.rating)}{'☆'.repeat(5 - a.rating)}
              </div>
            )}

            {/* Badge pour les nouveaux avis */}
            {isNew(a.createdAt) && (
              <div className="badge">🆕 Nouveau</div>
            )}

            <div className="actions">
              <button onClick={() => handleDelete(a.id)}>❌ Désapprouver</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
