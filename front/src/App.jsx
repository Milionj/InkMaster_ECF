import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import "./App.css";

// --- Lazy load pages (un fichier = un chunk) ---
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const Confidentialite = lazy(() => import("./pages/Confidentialite/Confidentialite"));
const Artistes = lazy(() => import("./pages/Artistes/Artiste"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Login = lazy(() => import("./pages/Login/Login"));
const Services = lazy(() => import("./pages/Services/Services"));
const MesTatouages = lazy(() => import("./pages/MesTatouages/MesTatoo"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ModerationGate = lazy(() => import("./components/ModerationAvis/ModerationGate"));
const RendezVousForm = lazy(() => import("./components/RendezVousForm/RendezVousForm"));
const RendezVousGestion = lazy(() => import("./components/RendezVousForm/RendezVousGestion"));


// Garde ce composant non lazy (léger, utilisé partout)
import ProtectedRoute from "./components/ProtectedRoute";

// Loader ultra simple pendant le chargement des chunks
function PageLoader() {
  return <div style={{ padding: "4rem 1rem", textAlign: "center" }}>Chargement…</div>;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <CookieBanner />   {/* bannière toujours dispo en bas de page */}
      <Suspense fallback={<PageLoader />}></Suspense>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Artiste connecté uniquement */}
          <Route
            path="/moderation"
            element={
              <ProtectedRoute>
                <ModerationGate />
              </ProtectedRoute>
            }
          />

          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/artistes" element={<Artistes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/rendez-vous" element={<RendezVousForm />} />
          <Route path="/gestion-rendez-vous" element={<RendezVousGestion />} />
          <Route path="/confidentialite" element={<Confidentialite />} />

          {/* Espace artiste connecté : gérer ses œuvres */}
          <Route
            path="/mes-tatouages"
            element={
              <ProtectedRoute>
                <MesTatouages />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <CookieBanner />
      <Footer />
    </Router>
  );
}
