import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.jsx';

import { UserProvider } from './context/UserContext.jsx';
import { CookieConsentProvider } from './context/CookieConsentContext.jsx';

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookieConsentProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CookieConsentProvider>
  </StrictMode>
);
