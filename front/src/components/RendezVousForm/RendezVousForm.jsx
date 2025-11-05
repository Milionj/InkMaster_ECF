import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./RendezVousForm.css";

export default function RendezVousForm() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    date: "",
    heure: "",
    message: "",
  });

  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validatePhone = (phone) =>
    /^(\+33|0)[1-9](\d{2}){4}$/.test(phone.trim());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setConfirmation("");

    const { nom, email, telephone, date, heure, message } = formData;

    if (!nom || !email || !date || !heure) {
      return setErreur("Les champs avec * sont obligatoires.");
    }

    if (!validateEmail(email)) {
      return setErreur("Email invalide.");
    }

    if (telephone && !validatePhone(telephone)) {
      return setErreur("Téléphone invalide (format FR).");
    }

    try {
      await addDoc(collection(db, "rendez_vous"), {
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        date,
        heure,
        message: message.trim(),
        timestamp: serverTimestamp(),
      });

      setConfirmation("✅ Rendez-vous enregistré !");
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        date: "",
        heure: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setErreur("❌ Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rendezvous-form">
      <h2>Prendre un rendez-vous</h2>

      <input name="nom" placeholder="Votre nom *" value={formData.nom} onChange={handleChange} />
      <input name="email" placeholder="Votre email *" value={formData.email} onChange={handleChange} />
      <input name="telephone" placeholder="Téléphone (FR)" value={formData.telephone} onChange={handleChange} />
      <input type="date" name="date" value={formData.date} onChange={handleChange} />
      <input type="time" name="heure" value={formData.heure} onChange={handleChange} />
      <textarea name="message" placeholder="Décrivez votre projet de tatouage" value={formData.message} onChange={handleChange} />

      <button type="submit">Envoyer</button>

      {confirmation && <p className="success">{confirmation}</p>}
      {erreur && <p className="error">{erreur}</p>}
    </form>
  );
}
