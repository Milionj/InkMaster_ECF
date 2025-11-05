import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import "./Contact.css";

const Contact = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setConfirmation("");

    if (!nom || !prenom || !email || !message) {
      return setErreur("Tous les champs sont obligatoires.");
    }

    if (!validateEmail(email)) {
      return setErreur("Adresse email invalide.");
    }

    try {
      await addDoc(collection(db, "contact"), {
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      });

      setConfirmation("✅ Message envoyé !");
      setNom("");
      setPrenom("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setErreur("❌ Erreur d'envoi. Réessayez.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Nous contacter</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Nom</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} required />

        <label>Prénom</label>
        <input value={prenom} onChange={(e) => setPrenom(e.target.value)} required />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit">Envoyer</button>
      </form>

      {confirmation && <p className="confirmation">{confirmation}</p>}
      {erreur && <p className="error">{erreur}</p>}
    </div>
  );
};

export default Contact;
