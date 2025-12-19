import React, { useState, useEffect } from 'react';
import { fetchTatouagesByUser } from '../../api/backend.js';
import './Artistes.css';

const Artistes = () => {
  const [tatouagesWebs, setTatouagesWebs] = useState([]);
  const [tatouagesJade, setTatouagesJade] = useState([]);
  const [tatouagesCrusher, setTatouagesCrusher] = useState([]);

  const [indexWebs, setIndexWebs] = useState(0);
  const [indexJade, setIndexJade] = useState(0);
  const [indexCrusher, setIndexCrusher] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [webs, jade, crusher] = await Promise.all([
          fetchTatouagesByUser(16),
          fetchTatouagesByUser(17),
          fetchTatouagesByUser(18),
        ]);
        setTatouagesWebs(webs);
        setTatouagesJade(jade);
        setTatouagesCrusher(crusher);
      } catch (err) {
        console.error('Erreur de chargement des tatouages', err);
      }
    };
    loadData();
  }, []);

  const next = (index, setIndex, gallery) => {
    setIndex(gallery.length ? (index + 1) % gallery.length : 0);
  };

  const prev = (index, setIndex, gallery) => {
    setIndex(gallery.length ? (index - 1 + gallery.length) % gallery.length : 0);
  };

  const ArtistGallery = ({ tatouages, index, setIndex, nom, description, photo }) => (
    <div className="artist-block" key={nom}>
      <div className="artist-header">
        <div className="artist-media">
          <img src={photo} alt={nom} className="artist-photo" />
        </div>

        <div className="artist-desc">
          <h3>{nom}</h3>
          <p>{description}</p>
          <span>InkMaster</span><br />
          <span>{nom}</span>
        </div>
      </div>

      <div className="tattoo-carousel">
        <button
          className="carousel-arrow"
          type="button"
          aria-label="Tatouage précédent"
          onClick={() => prev(index, setIndex, tatouages)}
          disabled={tatouages.length === 0}
        >
          &lt;
        </button>

        <div className="tattoo-display">
          {tatouages.length > 0 ? (
            <>
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
          type="button"
          aria-label="Tatouage suivant"
          onClick={() => next(index, setIndex, tatouages)}
          disabled={tatouages.length === 0}
        >
          &gt;
        </button>
      </div>
    </div>
  );

  return (
    <div className="artist-container">
      <ArtistGallery
        tatouages={tatouagesWebs}
        index={indexWebs}
        setIndex={setIndexWebs}
        nom="Webs"
        description="Un trait précis, une vision unique : Webs transforme chaque peau en œuvre d'art."
        photo="/images/ArtisteSerge.jpg"
      />

      <ArtistGallery
        tatouages={tatouagesJade}
        index={indexJade}
        setIndex={setIndexJade}
        nom="Jade"
        description="Jade tatoueuse inspirée. Brut, vrai, sans censure."
        photo="/images/Artiste3.jpg"
      />

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
