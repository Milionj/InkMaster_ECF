import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'inkmaster_cookie_consent';
const CookieConsentContext = createContext();

export function CookieConsentProvider({ children }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setConsentGiven(stored === 'accepted');
    setIsReady(true);
  }, []);

  const accept = () => {
    setConsentGiven(true);
    localStorage.setItem(STORAGE_KEY, 'accepted');
    const sixMonths = 60 * 60 * 24 * 30 * 6;
    document.cookie = `inkmaster_consent=accepted;path=/;max-age=${sixMonths}`;
  };

  return (
    <CookieConsentContext.Provider value={{ consentGiven, isReady, accept }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export const useCookieConsent = () => useContext(CookieConsentContext);
