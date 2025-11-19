import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // État du menu burger
  const { isAuthenticated, role, logout } = useUser(); // Données du contexte utilisateur
  const location = useLocation();

  // Ouvre/ferme le menu burger
  const toggleBurger = () => {
    setIsOpen(!isOpen);
  };

  // Ferme le menu burger à chaque changement de route
  useEffect(() => {
    setIsOpen(false);
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

        {/* Liens de navigation */}
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" onClick={toggleBurger}>Accueil</Link>
          <Link to="/services" onClick={toggleBurger}>Services</Link>
          <Link to="/artistes" onClick={toggleBurger}>Artistes</Link>
          <Link to="/contact" onClick={toggleBurger}>Contact</Link>

          {/* 🔹 PUBLIC : bouton "prendre rendez-vous" uniquement si NON connecté */}
          {!isAuthenticated && (
            <Link to="/rendez-vous" onClick={toggleBurger}>
              prendre <strong>rendez-vous</strong>
            </Link>
          )}

          {/* Si connecté */}
          {isAuthenticated ? (
            <>
              {/* Affiche le rôle de l’utilisateur (admin ou artiste) */}
              <span className="user-role">Connecté : {role}</span>

              {/* Lien admin visible uniquement pour les admins */}
              {role === 'admin' && (
                <Link to="/dashboard" onClick={toggleBurger}>
                  Tableau de bord
                </Link>
              )}

              {/* Lien artiste spécifique */}
              {role === 'artiste' && (
                <Link to="/mes-tatouages" onClick={toggleBurger}>
                  Mes tatouages
                </Link>
              )}

              {role === 'artiste' && (
                <Link to="/moderation" onClick={toggleBurger}>
                  Modérer les avis
                </Link>
              )}

              {/* 🔹 CONNECTÉ (admin ou artiste) : "Gérer les rendez-vous" */}
              {(role === 'artiste' || role === 'admin') && (
                <Link to="/gestion-rendez-vous" onClick={toggleBurger}>
                  Gérer les rendez-vous
                </Link>
              )}

              {/* Bouton de déconnexion */}
              <button
                className="logout-btn"
                onClick={async () => {
                  await logout();
                  toggleBurger();
                }}
              >
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
