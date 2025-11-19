import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../context/CookieConsentContext';
import './CookieBanner.css';

export default function CookieBanner() {
  const { consentGiven, isReady, accept } = useCookieConsent();

  if (!isReady || consentGiven) return null;

  return (
    <div className="cookie-banner simple" role="dialog" aria-live="polite">
      <div className="cookie-content">
        <h3>Cookies & confidentialité</h3>
        <p>
          Nous utilisons un cookie pour mémoriser votre consentement. En cliquant sur « J&apos;accepte
          », vous confirmez avoir pris connaissance de notre{' '}
          <Link to="/confidentialite">politique de confidentialité</Link>.
        </p>
      </div>
      <button type="button" className="cookie-btn primary" onClick={accept}>
        J&apos;accepte
      </button>
    </div>
  );
}
