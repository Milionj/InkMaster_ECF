import React, { useState } from 'react';
import './Artistes.css';

// === Import des images des artistes ===
import ArtistWebs from '../../assets/images/ArtisteSerge.jpg';
import ArtistJade from '../../assets/images/Artiste3.jpg';
import ArtistCrusher from '../../assets/images/Artiste2.jpg';

// === Import des images de tatouages de chaque artiste ===
// Webs
import WebsTat1 from '../../assets/images/RelationPassé.jpg';
import WebsTat2 from '../../assets/images/Maison.jpg';
// Jade
import JadeTat1 from '../../assets/images/RegardCéleste.webp';
import JadeTat2 from '../../assets/images/tribal_Animal.webp';
// Crusher
import CrusherTat1 from '../../assets/images/Des_utérus.jpg';
import CrusherTat2 from '../../assets/images/fumée.jpg';

const Artistes = () => {
  // === États pour suivre l'index de l'œuvre affichée pour chaque artiste ===
  const [indexWebs, setIndexWebs] = useState(0);
  const [indexJade, setIndexJade] = useState(0);
  const [indexCrusher, setIndexCrusher] = useState(0);

  // === Tableaux contenant les œuvres de chaque artiste ===
  const galleryWebs = [
    {
      image: WebsTat1,
      title: 'Relations passées',
      desc: 'Seul face à la lune... hommage mélancolique aux âmes perdues.',
    },
    {
      image: WebsTat2,
      title: 'Regard céleste',
      desc: 'Un regard qui traverse les tempêtes... vision poétique.',
    },
  ];

  const galleryJade = [
    {
      image: JadeTat1,
      title: 'Regard céleste',
      desc: 'Une explosion d’émotions dans le regard. Réalisme et intensité.',
    },
    {
      image: JadeTat2,
      title: 'Tribal animal',
      desc: 'Connexion aux instincts sauvages. Force, liberté, héritage.',
    },
  ];

  const galleryCrusher = [
    {
      image: CrusherTat1,
      title: 'Why so serious ?',
      desc: 'Grincement du Joker. Acceptation des cicatrices personnelles.',
    },
    {
      image: CrusherTat2,
      title: 'Fumée',
      desc: 'Tatouage éphémère, mouvement du vent, spiritualité floue.',
    },
  ];

  // === Fonctions de navigation fléchée dans les galeries ===
  const next = (index, setIndex, gallery) => {
    // On passe à l'élément suivant en boucle
    setIndex((index + 1) % gallery.length);
  };

  const prev = (index, setIndex, gallery) => {
    // On recule dans la galerie, en bouclant si nécessaire
    setIndex((index - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="artist-container">

      {/* === Artiste 1 : Webs === */}
      <div className="artist-block">
        <div className="artist-header">
          <img src={ArtistWebs} alt="Webs" />
          <div className="artist-desc">
            <h3>Tatoueur</h3>
            <p>Un trait précis, une vision unique : Webs transforme chaque peau en œuvre d’art.</p>
            <span>InkMaster</span>
          </div>
        </div>
        {/* Galerie carrousel avec flèches */}
        <div className="tattoo-carousel">
          <button className="carousel-arrow" onClick={() => prev(indexWebs, setIndexWebs, galleryWebs)}>←</button>
          <div className="tattoo-display">
            <img src={galleryWebs[indexWebs].image} alt={galleryWebs[indexWebs].title} />
            <h4>{galleryWebs[indexWebs].title}</h4>
            <p>{galleryWebs[indexWebs].desc}</p>
          </div>
          <button className="carousel-arrow" onClick={() => next(indexWebs, setIndexWebs, galleryWebs)}>→</button>
        </div>
      </div>

      {/* === Artiste 2 : Jade === */}
      <div className="artist-block">
        <div className="artist-header">
          <img src={ArtistJade} alt="Jade" />
          <div className="artist-desc">
            <h3>Tatoueuse</h3>
            <p>Street dans l’âme, feu dans les veines : Jade tatoue comme elle respire – brut, vrai, sans censure.</p>
            <span>InkMaster</span>
          </div>
        </div>
        {/* Galerie carrousel avec flèches */}
        <div className="tattoo-carousel">
          <button className="carousel-arrow" onClick={() => prev(indexJade, setIndexJade, galleryJade)}>←</button>
          <div className="tattoo-display">
            <img src={galleryJade[indexJade].image} alt={galleryJade[indexJade].title} />
            <h4>{galleryJade[indexJade].title}</h4>
            <p>{galleryJade[indexJade].desc}</p>
          </div>
          <button className="carousel-arrow" onClick={() => next(indexJade, setIndexJade, galleryJade)}>→</button>
        </div>
      </div>

      {/* === Artiste 3 : Crusher === */}
      <div className="artist-block">
        <div className="artist-header">
          <img src={ArtistCrusher} alt="Crusher" />
          <div className="artist-desc">
            <h3>Tatoueur / Perceur</h3>
            <p>La rue dans le sang, chrome sous la peau – Crusher, extraverti qui trace et perce sans limite.</p>
            <span>InkMaster</span>
          </div>
        </div>
        {/* Galerie carrousel avec flèches */}
        <div className="tattoo-carousel">
          <button className="carousel-arrow" onClick={() => prev(indexCrusher, setIndexCrusher, galleryCrusher)}>←</button>
          <div className="tattoo-display">
            <img src={galleryCrusher[indexCrusher].image} alt={galleryCrusher[indexCrusher].title} />
            <h4>{galleryCrusher[indexCrusher].title}</h4>
            <p>{galleryCrusher[indexCrusher].desc}</p>
          </div>
          <button className="carousel-arrow" onClick={() => next(indexCrusher, setIndexCrusher, galleryCrusher)}>→</button>
        </div>
      </div>

    </div>
  );
};

export default Artistes;
