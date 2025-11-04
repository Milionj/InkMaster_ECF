// Importation des hooks React
import { useState } from "react";
// Importation de la configuration Firebase
import { db } from "../../firebase";
// Importation des fonctions Firestore nécessaires
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./RendezVousForm.css"; 

export default function RendezVousForm() {
  // Définition de l'état du formulaire avec les champs nécessaires
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    date: "",
    heure: "",
    message: "",
  });

  // États pour afficher un message de confirmation ou d’erreur
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");

  // Fonction appelée à chaque frappe dans un champ du formulaire
  // Elle met à jour la clé correspondante dans formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction de soumission du formulaire (appelée au clic sur “Envoyer”)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setErreur("");
    setConfirmation("");

    // Récupération des champs du formulaire
    const { nom, email, telephone, date, heure, message } = formData;

    // Vérifie que les champs obligatoires ne sont pas vides
    if (!nom || !email || !date || !heure) {
      setErreur("Merci de remplir les champs obligatoires.");
      return; // Interrompt la soumission si un champ obligatoire est manquant
    }

    try {
      // Ajoute un nouveau document dans la collection “rendez_vous”
      await addDoc(collection(db, "rendez_vous"), {
        ...formData,
        timestamp: serverTimestamp(), // nom de clé corrigé
      });

      // Affiche un message de succès à l'utilisateur
      setConfirmation("✅ Rendez-vous enregistré avec succès !");

      // Réinitialisation du formulaire
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        date: "",
        heure: "",
        message: "",
      });
    } catch (err) {
      // En cas d’erreur (ex: problème de connexion ou permission Firebase)
      console.error(err);
      setErreur("❌ Une erreur s'est produite.");
    }
  };

  // Rendu du formulaire (structure JSX)
  return (
    <div className="rendez-vous">
    <form onSubmit={handleSubmit} className="rendezvous-form">
      <h2>Prendre un rendez-vous</h2>

      {/* Champ Nom */}
      <input
        type="text"
        name="nom"
        placeholder="Votre nom *"
        value={formData.nom}
        onChange={handleChange}
      />

      {/* Champ Email */}
      <input
        type="email"
        name="email"
        placeholder="Votre email *"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Champ Téléphone (optionnel) */}
      <input
        type="tel"
        name="telephone"
        placeholder="Téléphone"
        value={formData.telephone}
        onChange={handleChange}
      />

      {/* Date du rendez-vous */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />

      {/* Heure du rendez-vous */}
      <input
        type="time"
        name="heure"
        value={formData.heure}
        onChange={handleChange}
      />

      {/* Message optionnel pour décrire le projet */}
      <textarea
        name="message"
        placeholder="Décrivez votre projet de tatouage"
        value={formData.message}
        onChange={handleChange}
      />

      {/* Bouton d’envoi */}
      <button type="submit">Envoyer</button>

      {/* Messages de confirmation ou d’erreur */}
      {confirmation && <p className="success">{confirmation}</p>}
      {erreur && <p className="error">{erreur}</p>}
    </form>
    </div>
  );
}
