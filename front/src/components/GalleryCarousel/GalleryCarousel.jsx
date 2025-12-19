import React, { useState, useEffect } from 'react';
import { fetchTatouagesPublic } from '../../api/backend.js';
import './GalleryCarousel.css';

const GalleryCarousel = () => {
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchTatouages = async () => {
      try {
        const res = await fetchTatouagesPublic();
        setArtworks(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Erreur lors du chargement des tatouages', err);
        setArtworks([]);
      }
    };

    fetchTatouages();
  }, []);

  const totalPages = Math.ceil(artworks.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = artworks.slice(startIndex, startIndex + itemsPerPage);

  const goToPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="carousel-section">
      <div className="cards">
        {currentItems.map((art) => (
          <article key={art.id_tatouage || art.id || `${art.titre}-${art.image}`}>
            <div className="image-wrapper">
              <img src={`/images/${art.image}`} alt={art.titre} />
            </div>
            <div className="article-preview">
              <h2>{art.titre}</h2>
              <p>{art.description}</p>
              <p><strong>Artiste :</strong> {art.prenom_artiste} {art.nom_artiste}</p>
            </div>
          </article>
        ))}
      </div>

      <nav className="pagination_navigation" aria-label="Navigation de la galerie">
        <button onClick={goToPrev} className="pagination_button" disabled={page === 1}>
          &lt;
        </button>

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

        <button onClick={goToNext} className="pagination_button" disabled={page === totalPages}>
          &gt;
        </button>
      </nav>
    </section>
  );
};

export default GalleryCarousel;
