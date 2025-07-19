import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [tattoos, setTattoos] = useState([]);
  const [services, setServices] = useState([]);
  const [erreur, setErreur] = useState('');

  const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', password: '', role: 'artiste' });
  const [newTattoo, setNewTattoo] = useState({ titre: '', description: '', image: '', id_utilisateur: '' });
  const [newService, setNewService] = useState({ nom: '', description: '' });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://localhost:3001/utilisateurs', config);
      const tattoosRes = await axios.get('http://localhost:3001/tatouages', config);
      const servicesRes = await axios.get('http://localhost:3001/services', config);

      setUsers(usersRes.data);
      setTattoos(tattoosRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors du chargement des données.");
    }
  };

  // CRUD UTILISATEURS
  const creerUser = async () => {
    await axios.post('http://localhost:3001/api/utilisateurs', newUser, config);
    setNewUser({ nom: '', prenom: '', email: '', password: '', role: 'artiste' });
    fetchData();
  };

  const modifierUser = async (id, champ, valeur) => {
    const userToUpdate = users.find(u => u.id === id);
    await axios.put(`http://localhost:3001/api/utilisateurs/${id}`, { ...userToUpdate, [champ]: valeur }, config);
    fetchData();
  };

  const supprimerUser = async (id) => {
    await axios.delete(`http://localhost:3001/api/utilisateurs/${id}`, config);
    fetchData();
  };

  // CRUD TATOUAGES
  const creerTattoo = async () => {
    await axios.post('http://localhost:3001/api/tatouages', newTattoo, config);
    setNewTattoo({ titre: '', description: '', image: '', id_utilisateur: '' });
    fetchData();
  };

  const modifierTattoo = async (id, champ, valeur) => {
    const tattooToUpdate = tattoos.find(t => t.id === id);
    await axios.put(`http://localhost:3001/api/tatouages/${id}`, { ...tattooToUpdate, [champ]: valeur }, config);
    fetchData();
  };

  const supprimerTattoo = async (id) => {
    await axios.delete(`http://localhost:3001/api/tatouages/${id}`, config);
    fetchData();
  };

  // CRUD SERVICES
  const creerService = async () => {
    await axios.post('http://localhost:3001/api/services', newService, config);
    setNewService({ nom: '', description: '' });
    fetchData();
  };

  const modifierService = async (id, champ, valeur) => {
    const serviceToUpdate = services.find(s => s.id === id);
    await axios.put(`http://localhost:3001/api/services/${id}`, { ...serviceToUpdate, [champ]: valeur }, config);
    fetchData();
  };

  const supprimerService = async (id) => {
    await axios.delete(`http://localhost:3001/api/services/${id}`, config);
    fetchData();
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Admin InkMaster</h1>

      {erreur && <p className="error">{erreur}</p>}

      {/* UTILISATEURS */}
      <section>
        <h2>Utilisateurs</h2>
        <form onSubmit={(e) => { e.preventDefault(); creerUser(); }}>
          <input placeholder="Nom" value={newUser.nom} onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} />
          <input placeholder="Prénom" value={newUser.prenom} onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })} />
          <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input placeholder="Mot de passe" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="artiste">Artiste</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Créer</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Rôle</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><input value={user.nom} onChange={(e) => modifierUser(user.id, 'nom', e.target.value)} /></td>
                <td><input value={user.prenom} onChange={(e) => modifierUser(user.id, 'prenom', e.target.value)} /></td>
                <td><input value={user.email} onChange={(e) => modifierUser(user.id, 'email', e.target.value)} /></td>
                <td><input value={user.role} onChange={(e) => modifierUser(user.id, 'role', e.target.value)} /></td>
                <td><button onClick={() => supprimerUser(user.id)}>Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* TATOUAGES */}
      <section>
        <h2>Tatouages</h2>
        <form onSubmit={(e) => { e.preventDefault(); creerTattoo(); }}>
          <input placeholder="Titre" value={newTattoo.titre} onChange={(e) => setNewTattoo({ ...newTattoo, titre: e.target.value })} />
          <input placeholder="Description" value={newTattoo.description} onChange={(e) => setNewTattoo({ ...newTattoo, description: e.target.value })} />
          <input placeholder="Image URL" value={newTattoo.image} onChange={(e) => setNewTattoo({ ...newTattoo, image: e.target.value })} />
          <input placeholder="ID Artiste" value={newTattoo.id_utilisateur} onChange={(e) => setNewTattoo({ ...newTattoo, id_utilisateur: e.target.value })} />
          <button type="submit">Créer</button>
        </form>

        <table>
          <thead>
            <tr><th>ID</th><th>Titre</th><th>Description</th><th>Image</th><th>Artiste</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tattoos.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td><input value={t.titre} onChange={(e) => modifierTattoo(t.id, 'titre', e.target.value)} /></td>
                <td><input value={t.description} onChange={(e) => modifierTattoo(t.id, 'description', e.target.value)} /></td>
                <td><img src={t.image} alt={t.titre} /><br />
                    <input value={t.image} onChange={(e) => modifierTattoo(t.id, 'image', e.target.value)} />
                </td>
                <td><input value={t.id_utilisateur} onChange={(e) => modifierTattoo(t.id, 'id_utilisateur', e.target.value)} /></td>
                <td><button onClick={() => supprimerTattoo(t.id)}>Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SERVICES */}
      <section>
        <h2>Services</h2>
        <form onSubmit={(e) => { e.preventDefault(); creerService(); }}>
          <input placeholder="Nom" value={newService.nom} onChange={(e) => setNewService({ ...newService, nom: e.target.value })} />
          <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
          <button type="submit">Créer</button>
        </form>

        <table>
          <thead><tr><th>ID</th><th>Nom</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td><input value={s.nom} onChange={(e) => modifierService(s.id, 'nom', e.target.value)} /></td>
                <td><input value={s.description} onChange={(e) => modifierService(s.id, 'description', e.target.value)} /></td>
                <td><button onClick={() => supprimerService(s.id)}>Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
