import React, { useState, useEffect } from 'react';
import './CommentsSection.css';

const CommentsSection = () => {
  //  États pour gérer le formulaire et les commentaires
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // 
  const [confirmation, setConfirmation] = useState('');
  const [rating, setRating] = useState(0); // note de 1 à 5
  const [comments, setComments] = useState([]);

  //  useEffect exécuté une fois au chargement (componentDidMount)
  useEffect(() => {
    setComments([
      {
        email: 'inkfan@mail.com',
        message: 'Super ambiance, j’ai adoré mon tatouage !',
        rating: 5,
        approved: true
      },
      {
        email: 'client@paris.com',
        message: 'Salon très pro et propre. Merci !',
        rating: 4,
        approved: true
      },
    ]);
  }, []);

  //  Fonction de gestion de l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simule l'ajout d'un commentaire (non approuvé)
    setComments(prev => [
      ...prev,
      { email, message, rating, approved: false }
    ]);

    setConfirmation('Merci pour votre commentaire, il sera validé sous peu.');
    setEmail('');
    setMessage('');
    setRating(0);

    setTimeout(() => setConfirmation(''), 5000);
  };
 return (
    <section id="avis-section">
      <h2>Avis des visiteurs</h2>

      <div className="comments-container">
        {/* Zone qui affiche uniquement les commentaires validés */}
        <div className="comments-list">
          {comments
            .filter(comment => comment.approved) // Ne garde que ceux approuvés
            .map((comment, idx) => (
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

        {/* Affiche un message de confirmation si besoin */}
        {confirmation && (
          <p className="confirmation-message">{confirmation}</p>
        )}

        {/* Formulaire de soumission de commentaire */}
        <form className="comment-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Met à jour le state à chaque frappe
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Met à jour le state à chaque frappe
          ></textarea>

          {/*  les étoiles dans le formulaire */}
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

          <button type="submit">Envoyer</button> {/* Soumet le formulaire */}
        </form>
      </div>
    </section>
  );
  ;}

export default CommentsSection; 