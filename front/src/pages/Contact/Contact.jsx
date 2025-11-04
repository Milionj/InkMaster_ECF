import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Contact.css";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contact"), {
        nom,
        prenom,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      setConfirmation("Merci pour votre message !");
      setNom("");
      setPrenom("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Erreur :", error);
      setConfirmation("Une erreur est survenue.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button type="submit">Envoyer</button>
        {confirmation && <p className="confirmation">{confirmation}</p>}
      </form>
    </div>
  );
}
