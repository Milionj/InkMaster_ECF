import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App.jsx';

import { UserProvider } from './Context/UserContext.jsx';
import { CookieConsentProvider } from './Context/CookieConsentContext.jsx';
import { attachCsrfHeader } from './api/csrf.js';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(attachCsrfHeader);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookieConsentProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CookieConsentProvider>
  </StrictMode>
);

