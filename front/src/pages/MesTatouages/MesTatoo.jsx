// useEffect sert à faire une action après le rendu du composant 
// (appel API, écouteur d’événement, timer, etc.).
import React, { useEffect, useState } from "react";

// useState permet de créer une variable réactive, 
// c’est-à-dire une valeur qui fait re-render (rafraîchir) ton composant quand elle change
// -----
import axios from "axios"; 
//Pour appeler les API backend : AXIOS
import { useUser } from "../../context/UserContext";
import "./MesTatoo.css"; 

export default function MesTatouages() {
  const [tatouages, setTatouages] = useState([]); // Stockage local des tatouages de l'artiste
  const [loading, setLoading] = useState(true); // État pour afficher un message pendant le chargement
  const { user, loading: userLoading } = useUser();

  // pagination
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);

  // Récupérer les tatouages associés à l'artiste connecté
  const fetchTatouages = async () => {
    setLoading(true);
    if (!user?.id) {
      setLoading(false);
      setTatouages([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/utilisateurs/${user.id}/tatouages`);
      setTatouages(res.data); // On stocke les tatouages reçus
    } catch (err) {
      console.error("Erreur lors du chargement des tatouages :", err);
    } finally {
      setLoading(false); // On arrête l'affichage du "Chargement..."
    }
  };

  // Chargement de tatouages dès le chargement de la page
  useEffect(() => {
    if (userLoading) return;
    fetchTatouages();
  }, [user, userLoading]);

  // pagination : calcul des éléments affichés sur la page courante
  const totalPages = Math.ceil(tatouages.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = tatouages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mes-tatouages-container">
      <h1>Mes Tatouages</h1>

      {loading || userLoading ? (
        <p>Chargement en cours...</p>
      ) : tatouages.length === 0 ? (
        <p>Vous n’avez encore publié aucun tatouage.</p>
      ) : (
        <>
          <div className="tatouages-grid">
            {currentItems.map((tat) => (
              <div key={tat.id_tatouage} className="tatouage-card">
                <div className="image-wrapper">
                  <img src={`/images/${tat.image}`} alt={tat.titre} />
                </div>
                <h3>{tat.titre}</h3>
                <p>{tat.description}</p>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>←</button>
            <select value={page} onChange={(e) => setPage(Number(e.target.value))}>
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={`page-${i + 1}`} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>→</button>
          </div>
        </>
      )}
    </div>
  );
}
