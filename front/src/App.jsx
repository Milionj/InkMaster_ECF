import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/Home/HomePage'
import Artistes from './pages/Artistes/Artiste';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Services from './pages/Services/Services';
import Footer from './components/Footer/Footer';
import AdminPanel from './pages/AdminPanel';
// import DashboardAdmin from './pages/DashboardAdmin/DashboardAdmin';

const App = () => {

  return (
    <Router>
  <Navbar />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/artistes" element={<Artistes/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/services" element={<Services/>}/>
    {/* ajout d'un ' /* ' pour  autoriser React Admin à afficher toutes ses sous-routes dynamiques (/adminpanel/users, /adminpanel/users/create, etc.). */}
    <Route path="/admin/*" element={<AdminPanel />} />
    {/* <Route path="/dashboard" element={<DashboardAdmin />} /> */}
  </Routes>
  <Footer />
    </Router>
  );
};

export default App
