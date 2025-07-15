import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GalleryCarousel.css';

// CamelCase avec majuscule initiale (PascalCase) car c'est une fonction composant.**
const GalleryCarousel = () => {
    // variable normal **
    // nombre d'element a afficher défini
    const itemsPerPage = 3;

    // Hook React pour gerer la page actuellement affiché
    const [page, setPage] = useState(1);
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
  const fetchTatouages = async () => {
    try {
      const res = await axios.get('http://localhost:3001/tatouages');
      setArtworks(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des tatouages", err);
    }
  };

  fetchTatouages();
}, []);


    // Math.ceil() est une fonction JavaScript qui arrondit toujours un nombre à l'entier supérieur,
    // même si la partie décimale est très petite.
    // calculer le nombre de page a partir de la longueur du tableau
    const totalPages = Math.ceil(artworks.length / itemsPerPage);

    // calcule de l'index de départ de la page: actuelle
    const startIndex = (page - 1) * itemsPerPage;

    // On extrait les 3 éléments correspondant a la page actuelle 
    // slice(avec deux arguments: startIndex, endIndex) est une méthode qui permet d’extraire une partie d’un tableau, sans le modifier.
    const currentItems = artworks.slice(startIndex, startIndex + itemsPerPage);

    // Fonction pour aller a la page précédente

    const goToPrev = () => {
        if (page > 1) setPage(page - 1);
    };

    // fonction pour aller a la page suivante
    const goToNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

   return (
    <section className="carousel-section">
      {/* Affichage des œuvres en cours pour la page sélectionnée */}
      <div className="cards">

        {/* .map() méthode JavaScript qui permet de transformer chaque élément d’un tableau en un nouveau tableau. */}
        {currentItems.map((art, index) => (
          <article key={index}>
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

      {/* Pagination (navigation) en dessous des cartes */}
      <nav className="pagination_navigation" role="navigation" aria-label="Navigation de la galerie">
        {/* Bouton page précédente (désactivé si page 1) */}
        <button onClick={goToPrev} className="pagination_button" disabled={page === 1}>
          ←
        </button>

        {/* Sélecteur de page (menu déroulant) */}
        <select
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          aria-label="Choisir une page"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i} value={i + 1}>
              Page {i + 1}
            </option>
          ))}
        </select>

        {/* Bouton page suivante (désactivé si dernière page) */}
        <button onClick={goToNext} className="pagination_button" disabled={page === totalPages}>
          →
        </button>
      </nav>
    </section>
  );
};

export default GalleryCarousel;
