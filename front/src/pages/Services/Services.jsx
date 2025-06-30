// src/pages/Services.jsx
import React from 'react';
import './Services.css';
import ArtisteEnActionGIF from '../../assets/images/ArtisteEnActionGIF.gif';
import ThemePiercingGIF from '../../assets/images/themePiercingGIF.gif';
import MachineTatooGIF from '../../assets/images/MachineTatooGIF.gif';
import Soins from '../../assets/images/Soins.webp'; 

const Services = () => {
  return (
    <div className="services-container">
      <h1>Nos Services</h1>

      <div className="service-card">
        <img src={ArtisteEnActionGIF} alt="Tatouage" />
        <div>
          <h2>Tatouage</h2>
          <p>
            Nous transformons vos idées, vos souvenirs et vos émotions en créations uniques et durables. Que vous soyez amateur de lignes fines, de motifs tribaux, de réalisme ou de lettrage, nos artistes mettent leur talent et leur sens du détail au service de votre projet. Chez nous, se faire tatouer, c’est bien plus qu’un acte esthétique : c’est une rencontre entre votre histoire et notre art.
          </p>
        </div>
      </div>

      <div className="service-card">
        <img src={ThemePiercingGIF} alt="Piercing" />
        <div>
          <h2>Piercing</h2>
          <p>
            Chez InkMaster, chaque piercing est réalisé dans le respect des normes d’hygiène les plus strictes, avec un accompagnement professionnel du début à la fin. Que vous optiez pour un classique discret ou une création plus audacieuse, notre équipe vous conseille et vous guide pour que votre choix reflète pleinement votre style, en toute sécurité.
          </p>
        </div>
      </div>

      <div className="service-card">
        <img src={MachineTatooGIF} alt="Retrait de tatouage" />
        <div>
          <h2>Retrait de tatouage</h2>
          <p>
            Chez InkMaster, nous comprenons que certains tatouages ne correspondent plus à votre histoire. Grâce à des technologies de détatouage avancées, nous vous accompagnons avec sérieux et bienveillance dans ce processus délicat. Qu’il s’agisse d’un cover, notre priorité est votre confort, votre sécurité et le respect de votre peau.
          </p>
        </div>
      </div>
      <div className="care-section">
  <h2>Prenez soins de vous</h2>
  <div className="care-content">
    <img src={Soins} alt="Soins" />
    <div>
      <h3>Votre attention !</h3>
      <p>
        Chez InkMaster, nous comprenons que certains tatouages ne correspondent plus à votre histoire.
        Grâce à des technologies de détatouage avancées, nous vous accompagnons avec sérieux et bienveillance dans ce processus délicat.
        <br /><br />
        Qu’il s’agisse d’un effacement total ou partiel en vue d’un cover, notre priorité est votre confort, votre sécurité et le respect de votre peau.
        <br /><br />
        Veuillez suivre les recommandations de nos spécialistes.
      </p>
    </div>
  </div>
</div>
    </div>
  );
};

export default Services;
