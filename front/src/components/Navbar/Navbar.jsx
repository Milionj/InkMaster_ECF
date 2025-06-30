import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // On importe le fichier CSS de la navbar

function Navbar() {
  // État pour ouvrir/fermer le menu burger
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour basculer l'ouverture du menu
  const toggleBurger = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Overlay sombre qui s'affiche derrière le menu ouvert (mobile) */}
      {isOpen && <div className="overlay" onClick={toggleBurger}></div>}

      {/* Barre de navigation principale */}
      <nav className="navbar">
        {/* Logo cliquable qui renvoie vers la page d'accueil */}
        <div className="navbar-left">
          <a href="/" className="logo">
            <span className="logo-blue">Ink</span>Master
          </a>
        </div>

        {/* Liens de navigation visibles en version desktop */}
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <a href="/">Accueil</a>
          <a href="/services">Services</a>
          <a href="/artistes">Artistes</a>
          <a href="/contact">Contact</a>
          <a href="/login" className="login-btn">Se connecter</a>
        </div>

        {/* Icône menu burger (visible uniquement sur mobile) */}
        <div className="burger" onClick={toggleBurger}>
          <div className={`line ${isOpen ? 'rotate1' : ''}`}></div>
          <div className={`line ${isOpen ? 'fade' : ''}`}></div>
          <div className={`line ${isOpen ? 'rotate2' : ''}`}></div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
