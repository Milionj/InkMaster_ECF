import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GalleryCarousel.css';

//  Composant GalleryCarousel : Carrousel d'affichage des tatouages
const GalleryCarousel = () => {

  // Nombre d’éléments à afficher par page (fixé à 3 ici)
  const itemsPerPage = 3;

  // Hooks React pour gérer les états
  const [page, setPage] = useState(1);              // Page actuelle
  const [artworks, setArtworks] = useState([]);     // Liste des tatouages

  // useEffect : Se déclenche au chargement du composant (équivalent à componentDidMount)
  useEffect(() => {
    const fetchTatouages = async () => {
      try {
        // Requête vers le backend pour récupérer les tatouages
const res = await axios.get('http://localhost:5000/api/tatouages/public', {
  headers: { 'Accept': 'application/json' } // Aucune autorisation requise
});



        setArtworks(res.data); // Stocke les données dans artworks
      } catch (err) {
        console.error("Erreur lors du chargement des tatouages", err);
      }
    };

    fetchTatouages();
  }, []); // [] signifie que ça ne se déclenche qu'une seule fois

  // Calcul du nombre total de pages avec Math.ceil pour arrondir au supérieur
  const totalPages = Math.ceil(artworks.length / itemsPerPage);

  // Calcul de l’index de départ pour la page actuelle
  const startIndex = (page - 1) * itemsPerPage;

  // Slice extrait les éléments correspondant à la page actuelle (pagination)
  const currentItems = artworks.slice(startIndex, startIndex + itemsPerPage);

  // Fonction pour aller à la page précédente (si ce n'est pas déjà la 1ère page)
  const goToPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  // Fonction pour aller à la page suivante (si ce n'est pas déjà la dernière)
  const goToNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="carousel-section">
      {/* Cartes des tatouages pour la page en cours */}
      <div className="cards">
{currentItems.map((art) => (
  <article key={art.id_tatouage || `${art.titre}-${art.image}`}>
    <figure>
      <img src={`/images/${art.image}`} alt={art.titre} />
    </figure>
    <div className="article-preview">
      <h2>{art.titre}</h2>
      <p>{art.description}</p>
      <p><strong>Artiste :</strong> {art.prenom_artiste} {art.nom_artiste}</p>
    </div>
  </article>
))}

      </div>

      {/* Pagination : navigation entre les pages */}
      <nav className="pagination_navigation" aria-label="Navigation de la galerie">
        {/* Bouton précédent (désactivé si on est à la première page) */}
        <button onClick={goToPrev} className="pagination_button" disabled={page === 1}>
          ←
        </button>

        {/* Sélecteur de page sous forme de menu déroulant */}
        <select
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          aria-label="Choisir une page"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={`page-${i + 1}`} value={i + 1}>
              Page {i + 1}
            </option>
          ))}
        </select>

        {/* Bouton suivant (désactivé si dernière page atteinte) */}
        <button onClick={goToNext} className="pagination_button" disabled={page === totalPages}>
          →
        </button>
      </nav>
    </section>
  );
};

export default GalleryCarousel;
