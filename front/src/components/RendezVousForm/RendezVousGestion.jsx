import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase"; // même chemin que dans RendezVousForm
import { useUser } from "../../context/UserContext";
import "./RendezVousGestion.css";

export default function RendezVousGestion() {
  const { role } = useUser();
  const navigate = useNavigate();

  const [rdvList, setRdvList] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  // Protection : seulement artiste + admin
  useEffect(() => {
    if (role !== "artiste" && role !== "admin") {
      navigate("/login");
    }
  }, [role, navigate]);

  // Récupération des rendez-vous depuis Firestore
  useEffect(() => {
    setLoading(true);
    setErreur("");

    const q = query(
      collection(db, "rendez_vous"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setRdvList(data);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur Firestore:", error);
        setErreur("Impossible de récupérer les rendez-vous.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChangeStatut = async (id, newStatut) => {
    try {
      await updateDoc(doc(db, "rendez_vous", id), {
        statut: newStatut,
      });
    } catch (error) {
      console.error("Erreur update statut:", error);
      setErreur("Impossible de mettre à jour le statut.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce rendez-vous ?")) return;

    try {
      await deleteDoc(doc(db, "rendez_vous", id));
    } catch (error) {
      console.error("Erreur suppression:", error);
      setErreur("Impossible de supprimer ce rendez-vous.");
    }
  };

  const rdvFiltres = rdvList.filter((rdv) => {
    if (filtreStatut === "tous") return true;
    const statut = rdv.statut || "en_attente";
    return statut === filtreStatut;
  });

  return (
    <section className="rdv-gestion-page">
      <div className="rdv-gestion-container">
        <header className="rdv-gestion-header">
          <div>
            <h1>Gestion des rendez-vous</h1>
            <p>Demandes envoyées depuis le formulaire de rendez-vous.</p>
          </div>

          <div className="rdv-filtre-wrapper">
            <label htmlFor="filtre">Filtrer par statut</label>
            <select
              id="filtre"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
            >
              <option value="tous">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="confirme">Confirmé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
        </header>

        {loading && <p>Chargement des rendez-vous...</p>}
        {erreur && <p className="rdv-error">{erreur}</p>}
        {!loading && !erreur && rdvFiltres.length === 0 && (
          <p>Aucun rendez-vous trouvé pour ce filtre.</p>
        )}

        <div className="rdv-table">
          <div className="rdv-table-header">
            <span>Client</span>
            <span>Contact</span>
            <span>Date / Heure</span>
            <span>Message</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>

          {rdvFiltres.map((rdv) => {
            const statutActuel = rdv.statut || "en_attente";

            return (
              <div className="rdv-table-row" key={rdv.id}>
                <div className="rdv-cell">
                  <strong>{rdv.nom || "Sans nom"}</strong>
                </div>

                <div className="rdv-cell rdv-contact">
                  <div>{rdv.email}</div>
                  {rdv.telephone && <div>{rdv.telephone}</div>}
                </div>

                <div className="rdv-cell">
                  <div>{rdv.date || "-"}</div>
                  <div>{rdv.heure || "-"}</div>
                </div>

                <div className="rdv-cell rdv-message">
                  {rdv.message || "Aucun message"}
                </div>

                <div className="rdv-cell">
                  <select
                    value={statutActuel}
                    onChange={(e) => handleChangeStatut(rdv.id, e.target.value)}
                    className={`rdv-select rdv-select-${statutActuel}`}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="confirme">Confirmé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>

                <div className="rdv-cell rdv-actions">
                  <button
                    type="button"
                    className="rdv-btn-delete"
                    onClick={() => handleDelete(rdv.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
