import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import './Contact.css';

const Contact = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contact"), {
        nom,
        prenom,
        email,
        message,
        createdAt: serverTimestamp()
      });

      setConfirmation("Merci pour votre message !");
      setNom('');
      setPrenom('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setConfirmation("Erreur lors de l'envoi. Réessayez.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>Nom</label>
        <input
          type="text"
          placeholder="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <label>Prénom</label>
        <input
          type="text"
          placeholder="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="email valide"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Message</label>
        <textarea
          placeholder="texte"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit">Envoyer</button>
      </form>

      {confirmation && <p className="confirmation">{confirmation}</p>}
    </div>
  );
};

export default Contact;
