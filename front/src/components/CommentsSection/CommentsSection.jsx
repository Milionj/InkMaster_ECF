import React, { useState, useEffect } from 'react';
import './CommentsSection.css';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; //  `db` exporté dans le fichier firebase.js
import { useAuth } from "../../Context/AuthContext";
import axios from 'axios';

const CommentsSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const { currentUser } = useAuth();

  // Fonction pour charger les commentaires approuvés
 const fetchComments = async () => {
  try {
    const avisCollection = collection(db, "avis");
    let q;

    if (currentUser?.email === 'crusher@inkmaster.com') {
      // Crusher voit tout (validés + non validés)
      q = query(avisCollection, orderBy("createdAt", "desc"));
    } else {
      // Les visiteurs voient seulement les commentaires validés
      q = query(avisCollection,
        where("approved", "==", true),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const loadedComments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setComments(loadedComments);
  } catch (error) {
    console.error("Erreur lors du chargement des commentaires :", error);
  }
};


  // Charger les commentaires au chargement
useEffect(() => {
  if (currentUser !== undefined) {
    fetchComments();
  }
}, [currentUser]);
;

  // Valider un commentaire (réservé à crusher@inkmaster.com)
  const validateComment = async (commentId) => {
    try {
      const token = await currentUser.getIdToken();

      await axios.patch(`http://localhost:5000/api/avis/${commentId}/validate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Commentaire validé !");
      fetchComments(); // Recharger les commentaires
    } catch (error) {
      console.error("Erreur de validation :", error);
      alert("Erreur lors de la validation");
    }
  };

  // Envoi d'un nouveau commentaire
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

        {/* Liste des commentaires validés */}
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

              {/* Bouton de validation pour crusher@inkmaster.com */}
              {currentUser?.email === 'crusher@inkmaster.com' && !comment.approved && (
              <button onClick={() => validateComment(comment.id)}>Valider</button>
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
