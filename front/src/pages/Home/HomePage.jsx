import React from "react";
import GalleryCarousel from "../../components/GalleryCarousel/GalleryCarousel";
import './HomePage.css';
import tattooGif from '../../assets/images/video_tatoo.gif.gif';
import CommentsSection from '../../components/CommentsSection/CommentsSection';
// import carteImg from '../../assets/images/carte_tatoo.jpg';

const HomePage = () =>{
      return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Partagez nous votre imagination</h1>
        <p>
          Découvrez nos œuvres et nos artistes plus impliqués que jamais pour répondre à vos besoins :
          tatouage personnalisé, piercing et retrait au laser.
        </p>
        <img src={tattooGif} alt="Tatouage en cours" className="hero-image" />
      </section>

      <section className="presentation-section">
        <h2>InkMaster</h2>
        <p>
          Un salon de tatouage moderne et inspirant, où chaque création raconte une histoire unique,
          désormais accompagnée de sa propre application web.
        </p>
            <GalleryCarousel />
          </section>

         <section className="location-section">
  <h2>Retrouvez nous</h2>

  <div className="location-content">
    <div className="location-map-container">
      {/* <img src={carteImg} alt="Carte InkMaster Paris" className="location-map" /> */}

          <iframe
      title="InkMaster Map"
      //  Centrée automatiquement sur "3 rue Lemercier 75017 Paris"
      className="location-map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9594727434284!2d2.322946576966637!3d48.88634539978413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e51a10e5cc7%3A0xa4e0f6b565bf13f6!2s3%20Rue%20Lemercier%2C%2075017%20Paris!5e0!3m2!1sfr!2sfr!4v1719678350410!5m2!1sfr!2sfr"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

    <div className="location-info">
      <p>
        Nous sommes situé dans l’un des quartiers les plus beaux et animés de Paris :
      </p>
      <h3>3 RUE LEMERCIER 75017 PARIS</h3>
      <p>Tel : 0155393939</p>
      <p>Tout les jours : 8h - 20h</p>
    </div>
  </div>
</section>

<CommentsSection />

    </div>
    
          );
          
};

export default HomePage;