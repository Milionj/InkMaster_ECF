// Import des modules principaux de React Router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import des composants communs du site
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import './App.css';
// Import des pages publiques
import HomePage from "./pages/Home/HomePage";
import Confidentialite from "./pages/Confidentialite/Confidentialite";
import Artistes from "./pages/Artistes/Artiste";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Services from "./pages/Services/Services";

// route protegé pour utilisateursconnecté, gerer tatouage
import MesTatouages from './pages/MesTatouages/MesTatoo';

// Import de la page Dashboard (admin uniquement)
import Dashboard from "./pages/Dashboard";

// Import du composant pour protéger certaines routes (connexion requise)
import ProtectedRoute from "./components/ProtectedRoute";

// Import de la logique qui gère l'accès à la modération des avis (artiste uniquement)
import ModerationGate from "./components/ModerationAvis/ModerationGate"; // composant sécurisé
import RendezVousForm from "./components/RendezVousForm/RendezVousForm";

export default function App() {
  return (
    <Router>
      {/* Barre de navigation en haut (logo, liens, menu burger) */}
      <Navbar />

      {/* Système de routes centralisées */}
      <Routes>
        {/* Route accessible uniquement aux artistes connectés */}
        <Route
          path="/moderation"
          element={
            <ProtectedRoute>
              <ModerationGate />
            </ProtectedRoute>
          }
        />

        {/* Pages publiques accessibles à tous */}
        <Route path="/" element={<HomePage />} />
        <Route path="/artistes" element={<Artistes />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/rendez-vous" element={<RendezVousForm/>} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        {/* Les utilisateurs gerent leurs tatouagees */}
        <Route
          path="/mes-tatouages"
          element={
            <ProtectedRoute>
              <MesTatouages />
            </ProtectedRoute>
          }
        />

        {/* Page admin : dashboard sécurisé (role = admin uniquement) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}
