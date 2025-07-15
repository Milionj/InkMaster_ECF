import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/Home/HomePage';
import Artistes from './pages/Artistes/Artiste';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Services from './pages/Services/Services';
import Footer from './components/Footer/Footer';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  //  Vérification simple : connecté + admin
  const isAdmin = localStorage.getItem('token') && localStorage.getItem('role') === 'admin';

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/artistes" element={<Artistes />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />

        {/*  Protection de l'interface admin */}
        <Route
          path="/admin/*"
          element={
            isAdmin ? <AdminPanel /> : <Navigate to="/login" />
          }
        />

        {/* Ancien dashboard désactivé */}
        {/* <Route path="/dashboard" element={<DashboardAdmin />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
