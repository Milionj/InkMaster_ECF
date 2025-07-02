import { useEffect, useState } from 'react';
import axios from 'axios'; // bibliothèque pour faire des appels HTTP (ici vers l'API Express).
import { useNavigate } from 'react-router-dom';
export default function DashboardAdmin() {
    const [utilisateurs, setUtilisateurs] = useState([]); //lister les utilisateurs récuprés
    const [error, setError ] = useState(''); //msg d'erreur en cas d'échec
    const navigate = useNavigate();

useEffect(() => {
    useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login'); //  Redirige si non-admin
    }
  }, [navigate]);

    const fetchUtilisateurs = async () => {
    try {
        const res = await axios.get('http://localhost:3001/utilisateurs'); // appel à l’API backend
        setUtilisateurs(res.data); //stocke les donnée reçu dans l'état
    } catch (err) {
        console.error(err);
        setError("impossible de charger les utilisateurs") //afficher un message d'erreur
    }
};

fetchUtilisateurs();  // appel immédiat de la fonction à l’intérieur du useEffect
  }, []);

   return (
    <div className="dashboard-container">
      <h1>Dashboard Administrateur</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h2>Utilisateurs</h2>
        <button onClick={() => alert("Formulaire d’ajout à venir...")}>
          Ajouter un utilisateur
        </button>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map(user => (
              <tr key={user.id_utilisateur}>
                <td>{user.id_utilisateur}</td>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}