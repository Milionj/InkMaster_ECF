import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // État du menu burger
  const { token, role, logout } = useUser(); // Données du contexte utilisateur

  // Ouvre/ferme le menu burger
  const toggleBurger = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();

useEffect(() => {
  setIsOpen(false); // ferme le menu burger à chaque changement de route
}, [location]);


  return (
    <>
      {/* Overlay sombre en arrière-plan quand le menu est ouvert (mobile) */}
      {isOpen && <div className="overlay" onClick={toggleBurger}></div>}

      {/* Barre de navigation principale */}
      <nav className="navbar">
        {/* Logo (cliquable) */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-blue">Ink</span>Master
          </Link>
        </div>

        {/* Liens de navigation (affichés selon état de connexion) */}
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" onClick={toggleBurger}>Accueil</Link>
          <Link to="/services" onClick={toggleBurger}>Services</Link>
          <Link to="/artistes" onClick={toggleBurger}>Artistes</Link>
          <Link to="/contact" onClick={toggleBurger}>Contact</Link>
          <Link to="/rendez-vous" onClick={toggleBurger}>prendre <strong>rendez-vous</strong></Link>
          {/* Si connecté */}
          {token ? (
            <>
              {/* Affiche le rôle de l’utilisateur (admin ou artiste) */}
              <span className="user-role">Connecté : {role}</span>

              {/* Lien admin visible uniquement pour les admins */}
              {role === 'admin' && (
                <Link to="/dashboard" onClick={toggleBurger}>Tableau de bord</Link>
              )}

              {/* Lien artiste spécifique */}
              {role === 'artiste' && (
                <Link to="/mes-tatouages" onClick={toggleBurger}>Mes tatouages</Link>
              )}
              {role === 'artiste' && (
              <Link to="/moderation" onClick={toggleBurger}>Modérer les avis</Link>
              )}


              {/* Bouton de déconnexion */}
              <button className="logout-btn" onClick={() => { logout(); toggleBurger(); }}>
                Déconnexion
              </button>
            </>
          ) : (
            // Sinon : lien de connexion
            <Link to="/login" className="login-btn" onClick={toggleBurger}>
              Se connecter
            </Link>
          )}
        </div>

        {/* Bouton burger visible en mobile */}
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
