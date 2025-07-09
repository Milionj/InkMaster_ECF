// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function DashboardAdmin() {
//   const [utilisateurs, setUtilisateurs] = useState([]); // État pour stocker les utilisateurs
//   const [error, setError] = useState(''); // État pour stocker une erreur éventuelle
//   const navigate = useNavigate();

//   //  Vérifie que l'utilisateur est bien un admin
//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     if (role !== 'admin') {
//       navigate('/login'); // Redirige vers /login si non-admin
//     }
//   }, [navigate]);

//   //  Récupère les utilisateurs depuis l’API Express (backend)
//   useEffect(() => {
//     const fetchUtilisateurs = async () => {
//       try {
//         const res = await axios.get('http://localhost:3001/utilisateurs', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}` // envoie le token JWT dans les headers
//           }
//         });
//         setUtilisateurs(res.data); // met à jour l’état avec les données reçues
//       } catch (err) {
//         console.error(err);
//         setError("Impossible de charger les utilisateurs");
//       }
//     };

//     // Création d'un nouvel utilisateur


//     fetchUtilisateurs(); // Appel dans le bon hook
//   }, []); // vide = une seule fois au chargement

//   return (
//     <div className="dashboard-container">
//       <h1>Dashboard Administrateur</h1>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <section>
//         <h2>Utilisateurs</h2>
//         <button onClick={() => alert("Formulaire d’ajout à venir...")}>
//           Ajouter un utilisateur
//         </button>

//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nom</th>
//               <th>Prénom</th>
//               <th>Email</th>
//               <th>Rôle</th>
//             </tr>
//           </thead>
//           <tbody>
//             {utilisateurs.map(user => (
//               <tr key={user.id_utilisateur}>
//                 <td>{user.id_utilisateur}</td>
//                 <td>{user.nom}</td>
//                 <td>{user.prenom}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// }
