import React, { useState, useEffect } from 'react';
import './CommentsSection.css'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';

const MAX_EMAIL = 120;
const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 10;

const CommentsSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [confirmation, setConfirmation] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  // Ecouter en temps reel les commentaires depuis Firestore
  useEffect(() => {
    const q = query(collection(db, 'avis'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() ?? null,
        };
      });
      setComments(loadedComments);
    });

    return () => unsubscribe();
  }, []);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Soumettre un nouvel avis
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConfirmation('');

    const emailTrim = email.trim();
    const messageTrim = message.trim();

    if (!isValidEmail(emailTrim) || emailTrim.length > MAX_EMAIL) {
      return setError("Email invalide ou trop long.");
    }

    if (messageTrim.length < MIN_MESSAGE || messageTrim.length > MAX_MESSAGE) {
      return setError(`Le message doit contenir entre ${MIN_MESSAGE} et ${MAX_MESSAGE} caracteres.`);
    }

    try {
      await addDoc(collection(db, 'avis'), {
        email: emailTrim,
        message: messageTrim,
        rating,
        createdAt: serverTimestamp(),
      });

      setConfirmation('Merci pour votre commentaire !');
      setEmail('');
      setMessage('');
      setRating(0);

      setTimeout(() => setConfirmation(''), 4000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
      setError("Impossible d'envoyer le commentaire. Reessayez.");
    }
  };

  return (
    <section id="avis-section">
      <h2>Avis des visiteurs</h2>

      <div className="comments-container">
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <strong>{comment.email}</strong>
              <p>{comment.message}</p>
              {comment.rating > 0 && (
                <div className="comment-rating">
                  {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}
                </div>
              )}
            </div>
          ))}
        </div>

        {confirmation && <p className="confirmation-message">{confirmation}</p>}
        {error && <p className="error-message">{error}</p>}

        <form className="comment-form" onSubmit={handleSubmit} noValidate>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            maxLength={MAX_EMAIL}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Message</label>
          <textarea
            required
            value={message}
            minLength={MIN_MESSAGE}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="rating-stars">
            <label>Note :</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star filled" : "star"}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <button type="submit">Envoyer</button>
        </form>
      </div>
    </section>
  );
};

export default CommentsSection;
