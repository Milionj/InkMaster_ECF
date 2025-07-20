import React, { useState, useEffect } from 'react';
import './Artistes.css';

const Artistes = () => {
  // États pour stocker les tatouages récupérés depuis la BDD pour chaque artiste
  const [tatouagesWebs, setTatouagesWebs] = useState([]);
  const [tatouagesJade, setTatouagesJade] = useState([]);
  const [tatouagesCrusher, setTatouagesCrusher] = useState([]);

  // États pour suivre l'index actuel dans le carrousel de chaque artiste
  const [indexWebs, setIndexWebs] = useState(0);
  const [indexJade, setIndexJade] = useState(0);
  const [indexCrusher, setIndexCrusher] = useState(0);

  // useEffect pour charger les tatouages au montage du composant
  useEffect(() => {
    // Récupérer les tatouages de Webs (id_utilisateur = 16)
    fetch('http://localhost:5000/api/utilisateurs/16/tatouages')
      .then(res => res.json())
      .then(data => setTatouagesWebs(data));

      

    // Récupérer les tatouages de Jade (id_utilisateur = 17)
    fetch('http://localhost:5000/api/utilisateurs/17/tatouages')
      .then(res => res.json())
      .then(data => setTatouagesJade(data));

    // Récupérer les tatouages de Crusher (id_utilisateur = 18)
    fetch('http://localhost:5000/api/utilisateurs/18/tatouages')
      .then(res => res.json())
      .then(data => setTatouagesCrusher(data));
  }, []); // Le tableau vide signifie : exécuter ce code 1 fois au chargement

  // Fonction pour passer à l'image suivante dans le carrousel
  const next = (index, setIndex, gallery) => {
    setIndex((index + 1) % gallery.length); // % pour boucler
  };

  // Fonction pour revenir à l'image précédente dans le carrousel
  const prev = (index, setIndex, gallery) => {
    setIndex((index - 1 + gallery.length) % gallery.length);
  };

  // Composant réutilisable pour afficher un artiste avec son carrousel
  const ArtistGallery = ({ tatouages, index, setIndex, nom, description, photo }) => (
    <div className="artist-block" key={nom}>
      <div className="artist-header">
        {/* Image de l’artiste (stockée dans public/images) */}
        <img src={photo} alt={nom} />
        <div className="artist-desc">
          <h3>{nom}</h3>
          <p>{description}</p>
          <span>InkMaster</span><br />
          <span>{nom}</span>
        </div>
      </div>
          
      {/* Carrousel de tatouages */}
      <div className="tattoo-carousel">
        <button
          className="carousel-arrow"
          onClick={() => prev(index, setIndex, tatouages)}
          disabled={tatouages.length === 0}
        >
          ←
        </button>

        <div className="tattoo-display">
          {tatouages.length > 0 ? (
            <>
             {/* Affichage de l’image du tatouage avec chemin relatif vers le dossier public/images */}
              <img src={`/images/${tatouages[index].image}`} alt={tatouages[index].titre} />
              <h4>{tatouages[index].titre}</h4>
              <p>{tatouages[index].description}</p>
            </>
          ) : (
            <p>Aucun tatouage disponible pour cet artiste.</p>
          )}
        </div>

        <button
          className="carousel-arrow"
          onClick={() => next(index, setIndex, tatouages)}
          disabled={tatouages.length === 0}
        >
          →
        </button>
      </div>
    </div>
  );

  return (
    <div className="artist-container">
      {/* Webs */}
      <ArtistGallery
        tatouages={tatouagesWebs}
        index={indexWebs}
        setIndex={setIndexWebs}
        nom="Webs"
        description="Un trait précis, une vision unique : Webs transforme chaque peau en œuvre d’art."
        photo="/images/ArtisteSerge.jpg"
      />

      {/* Jade */}
      <ArtistGallery
        tatouages={tatouagesJade}
        index={indexJade}
        setIndex={setIndexJade}
        nom="Jade"
        description="Street dans l’âme, feu dans les veines : Jade tatoue comme elle respire – brut, vrai, sans censure."
        photo="/images/Artiste3.jpg"
      />

      {/* Crusher */}
      <ArtistGallery
        tatouages={tatouagesCrusher}
        index={indexCrusher}
        setIndex={setIndexCrusher}
        nom="Crusher"
        description="La rue dans le sang, chrome sous la peau – Crusher, extraverti qui trace et perce sans limite."
        photo="/images/Artiste2.jpg"
      />
    </div>
  );
};

export default Artistes;
