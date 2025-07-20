import React, { useState, useEffect } from 'react';
import './CommentsSection.css';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; //  `db` exporté dans le fichier firebase.js

const CommentsSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);

  // Charger les commentaires validés depuis Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, "avis"),
          where("approved", "==", true),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const loadedComments = querySnapshot.docs.map(doc => doc.data());
        setComments(loadedComments);
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires :", error);
      }
    };

    fetchComments();
  }, []);

  // Envoi d'un commentaire dans Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "avis"), {
        email,
        message,
        rating,
        approved: false, // L'admin devra valider ce commentaire
        createdAt: serverTimestamp()
      });

      setConfirmation('Merci pour votre commentaire, il sera validé sous peu.');
      setEmail('');
      setMessage('');
      setRating(0);

      setTimeout(() => setConfirmation(''), 5000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  };

  return (
    <section id="avis-section">
      <h2>Avis des visiteurs</h2>

      <div className="comments-container">

        {/* Affichage des commentaires validés */}
        <div className="comments-list">
          {comments.map((comment, idx) => (
            <div key={idx} className="comment">
              <strong>{comment.email}</strong>
              <p>{comment.message}</p>
              {comment.rating && (
                <div className="comment-rating">
                  {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}
                </div>
              )}
            </div>
          ))}
        </div>

        {confirmation && <p className="confirmation-message">{confirmation}</p>}

        {/* Formulaire d'ajout de commentaire */}
        <form className="comment-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

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
