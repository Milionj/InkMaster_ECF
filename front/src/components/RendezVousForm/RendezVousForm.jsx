import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { isMock, createRendezVous } from "../../api/backend.js";
import "./RendezVousForm.css";

const MAX_NAME = 100;
const MAX_EMAIL = 120;
const MAX_PHONE = 20;
const MAX_MESSAGE = 1200;
const MIN_MESSAGE = 10;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePhone = (phone) => phone.trim() === "" || /^(\+33|0)[1-9](\d{2}){4}$/.test(phone.trim());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErreur("");
    setConfirmation("");

    const nomTrim = formData.nom.trim();
    const emailTrim = formData.email.trim();
    const telTrim = formData.telephone.trim();
    const messageTrim = formData.message.trim();

    if (!nomTrim || !emailTrim || !formData.date || !formData.heure) {
      return setErreur("Les champs avec * sont obligatoires.");
    }

    if (nomTrim.length > MAX_NAME) {
      return setErreur("Nom trop long.");
    }

    if (!validateEmail(emailTrim) || emailTrim.length > MAX_EMAIL) {
      return setErreur("Email invalide ou trop long.");
    }

    if (!validatePhone(telTrim) || telTrim.length > MAX_PHONE) {
      return setErreur("Téléphone invalide (format FR).");
    }

    if (messageTrim && (messageTrim.length < MIN_MESSAGE || messageTrim.length > MAX_MESSAGE)) {
      return setErreur(`Le message doit contenir entre ${MIN_MESSAGE} et ${MAX_MESSAGE} caractères.`);
    }

    setIsSubmitting(true);

    try {
      if (isMock) {
        await createRendezVous({
          nom: nomTrim,
          email: emailTrim,
          telephone: telTrim,
          date: formData.date,
          heure: formData.heure,
          message: messageTrim,
        });
      } else {
        await addDoc(collection(db, "rendez_vous"), {
          nom: nomTrim,
          email: emailTrim,
          telephone: telTrim,
          date: formData.date,
          heure: formData.heure,
          message: messageTrim,
          timestamp: serverTimestamp(),
        });
      }

      setConfirmation("Rendez-vous enregistré !");
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
      setErreur("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rendezvous-form" noValidate>
      <h2>Prendre un rendez-vous</h2>

      <input
        name="nom"
        placeholder="Votre nom *"
        value={formData.nom}
        maxLength={MAX_NAME}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Votre email *"
        value={formData.email}
        maxLength={MAX_EMAIL}
        onChange={handleChange}
        required
      />
      <input
        name="telephone"
        placeholder="Téléphone (FR)"
        value={formData.telephone}
        maxLength={MAX_PHONE}
        onChange={handleChange}
      />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="time" name="heure" value={formData.heure} onChange={handleChange} required />
      <textarea
        name="message"
        placeholder="Décrivez votre projet de tatouage"
        value={formData.message}
        minLength={MIN_MESSAGE}
        maxLength={MAX_MESSAGE}
        onChange={handleChange}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi..." : "Envoyer"}
      </button>

      {confirmation && <p className="success">{confirmation}</p>}
      {erreur && <p className="error">{erreur}</p>}
    </form>
  );
}
