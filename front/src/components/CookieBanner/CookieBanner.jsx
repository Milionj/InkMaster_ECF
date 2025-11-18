import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookieConsent");
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem("cookieConsent", "refused");
    setVisible(false);
    // Important :
    // Même en refusant, les cookies strictement nécessaires (auth, reCAPTCHA)
    // restent utilisés, mais aucun cookie de pub / tracking n’est déposé.
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        Nous utilisons uniquement des cookies techniques indispensables au bon
        fonctionnement du site : maintien de votre session sécurisée (cookie
        httpOnly) et protection anti-robots via Google reCAPTCHA. Aucun cookie
        publicitaire ni de traçage n’est utilisé.{" "}
        <Link to="/confidentialite">En savoir plus</Link>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn-cookie-secondary" onClick={handleRefuse}>
          Refuser
        </button>
        <button type="button" className="btn-cookie-primary" onClick={handleAccept}>
          Tout accepter
        </button>
      </div>
    </div>
  );
}
