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
import { isMock, fetchAvis, deleteAvis } from '../../api/backend.js';
import './ModerationAvis.css';

export default function ModerationAvis() {
  const [avis, setAvis] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const auth = getAuth();
    console.log('Utilisateur Firebase connecté :', auth.currentUser?.email);
  }, []);

  const isNew = (createdAt) => {
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    if (!date) return false;
    const diff = Date.now() - date;
    return diff < 1000 * 60 * 60 * 24;
  };

  useEffect(() => {
    if (isMock) {
      fetchAvis().then(setAvis).catch((err) => console.error(err));
      return undefined;
    }

    const q = query(collection(db, 'avis'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAvis(data);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      if (isMock) {
        await deleteAvis(id);
        setAvis((prev) => prev.filter((a) => a.id !== id));
      } else {
        await deleteDoc(doc(db, 'avis', id));
      }
      setMessage('Avis désapprouvé et supprimé.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Erreur suppression avis :', err);
      alert('Erreur : ' + err.message);
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

            {isNew(a.createdAt) && (
              <div className="badge">Nouveau</div>
            )}

            <div className="actions">
              <button onClick={() => handleDelete(a.id)}>Désapprouver</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
