import React from "react";
import GalleryCarousel from "../../components/GalleryCarousel/GalleryCarousel";
import './HomePage.css';
import tattooGif from '../../assets/images/video_tatoo.gif.gif';

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
    </div>
          );
          
};

export default HomePage;