import React, { useEffect, useState } from "react";
import { fetchTatouagesByUser } from "../../api/backend.js";
import { useUser } from "../../Context/UserContext";
import "./MesTatoo.css";

export default function MesTatouages() {
  const [tatouages, setTatouages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser();

  const itemsPerPage = 3;
  const [page, setPage] = useState(1);

  const fetchTatouages = async () => {
    setLoading(true);
    if (!user?.id) {
      setLoading(false);
      setTatouages([]);
      return;
    }

    try {
      const res = await fetchTatouagesByUser(user.id);
      setTatouages(res);
    } catch (err) {
      console.error("Erreur lors du chargement des tatouages :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    fetchTatouages();
  }, [user, userLoading]);

  const totalPages = Math.ceil(tatouages.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = tatouages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mes-tatouages-container">
      <h1>Mes Tatouages</h1>

      {loading || userLoading ? (
        <p>Chargement en cours...</p>
      ) : tatouages.length === 0 ? (
        <p>Vous n'avez encore publié aucun tatouage.</p>
      ) : (
        <>
          <div className="tatouages-grid">
            {currentItems.map((tat) => (
              <div key={tat.id_tatouage || tat.id} className="tatouage-card">
                <div className="image-wrapper">
                  <img src={`/images/${tat.image}`} alt={tat.titre} />
                </div>
                <h3>{tat.titre}</h3>
                <p>{tat.description}</p>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>&lt;</button>
            <select value={page} onChange={(e) => setPage(Number(e.target.value))}>
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={`page-${i + 1}`} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>&gt;</button>
          </div>
        </>
      )}
    </div>
  );
}
