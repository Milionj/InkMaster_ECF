import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import "./Contact.css";

const MAX_NAME = 100;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 1200;
const MIN_MESSAGE = 10;

const Contact = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setConfirmation("");

    const nomTrim = nom.trim();
    const prenomTrim = prenom.trim();
    const emailTrim = email.trim();
    const messageTrim = message.trim();

    if (!nomTrim || !prenomTrim || !emailTrim || !messageTrim) {
      return setErreur("Tous les champs sont obligatoires.");
    }

    if (nomTrim.length > MAX_NAME || prenomTrim.length > MAX_NAME) {
      return setErreur("Nom ou prenom trop long.");
    }

    if (!validateEmail(emailTrim) || emailTrim.length > MAX_EMAIL) {
      return setErreur("Adresse email invalide ou trop longue.");
    }

    if (messageTrim.length < MIN_MESSAGE || messageTrim.length > MAX_MESSAGE) {
      return setErreur(`Le message doit contenir entre ${MIN_MESSAGE} et ${MAX_MESSAGE} caracteres.`);
    }

    try {
      await addDoc(collection(db, "contact"), {
        nom: nomTrim,
        prenom: prenomTrim,
        email: emailTrim,
        message: messageTrim,
        createdAt: serverTimestamp(),
      });

      setConfirmation("Message envoye !");
      setNom("");
      setPrenom("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setErreur("Erreur d'envoi. Reessayez.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Nous contacter</h1>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <label>Nom</label>
        <input
          value={nom}
          maxLength={MAX_NAME}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <label>Prénom</label>
        <input
          value={prenom}
          maxLength={MAX_NAME}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          maxLength={MAX_EMAIL}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Message</label>
        <textarea
          value={message}
          minLength={MIN_MESSAGE}
          maxLength={MAX_MESSAGE}
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
