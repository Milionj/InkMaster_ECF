import { useEffect, useState } from 'react';
import {
  createService as apiCreateService,
  createTatouage as apiCreateTatouage,
  createUser as apiCreateUser,
  deleteService as apiDeleteService,
  deleteTatouage as apiDeleteTatouage,
  deleteUser as apiDeleteUser,
  fetchServices,
  fetchTatouagesAdmin,
  fetchUsers,
  updateService as apiUpdateService,
  updateTatouage as apiUpdateTatouage,
  updateUser as apiUpdateUser,
  isMock,
} from '../api/backend.js';
import './Dashboard.css';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [tattoos, setTattoos] = useState([]);
  const [services, setServices] = useState([]);
  const [erreur, setErreur] = useState('');

  const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', password: '', role: 'artiste' });
  const [newTattoo, setNewTattoo] = useState({ titre: '', description: '', image: '', id_utilisateur: '' });
  const [newService, setNewService] = useState({ nom: '', description: '' });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingTattoo, setIsCreatingTattoo] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, tattoosRes, servicesRes] = await Promise.all([
        fetchUsers(),
        fetchTatouagesAdmin(),
        fetchServices(),
      ]);
      setUsers(usersRes);
      setTattoos(tattoosRes);
      setServices(servicesRes);
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors du chargement des données.");
    }
  };

  const creerUser = async () => {
    if (isCreatingUser) return;
    setErreur('');
    setIsCreatingUser(true);
    try {
      await apiCreateUser(newUser);
      setNewUser({ nom: '', prenom: '', email: '', password: '', role: 'artiste' });
      fetchData();
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de la création utilisateur.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const modifierUser = async (id, champ, valeur) => {
    const userToUpdate = users.find((u) => u.id === id);
    await apiUpdateUser(id, { ...userToUpdate, [champ]: valeur });
    fetchData();
  };

  const supprimerUser = async (id) => {
    await apiDeleteUser(id);
    fetchData();
  };

  const creerTattoo = async () => {
    if (isCreatingTattoo) return;
    setErreur('');
    setIsCreatingTattoo(true);
    try {
      await apiCreateTatouage({ ...newTattoo, id_utilisateur: Number(newTattoo.id_utilisateur) });
      setNewTattoo({ titre: '', description: '', image: '', id_utilisateur: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de la création du tatouage.");
    } finally {
      setIsCreatingTattoo(false);
    }
  };

  const modifierTattoo = async (id, champ, valeur) => {
    const tattooToUpdate = tattoos.find((t) => t.id === id || t.id_tatouage === id);
    await apiUpdateTatouage(id, { ...tattooToUpdate, [champ]: valeur });
    fetchData();
  };

  const supprimerTattoo = async (id) => {
    await apiDeleteTatouage(id);
    fetchData();
  };

  const creerService = async () => {
    if (isCreatingService) return;
    setErreur('');
    setIsCreatingService(true);
    try {
      await apiCreateService(newService);
      setNewService({ nom: '', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de la création du service.");
    } finally {
      setIsCreatingService(false);
    }
  };

  const modifierService = async (id, champ, valeur) => {
    const serviceToUpdate = services.find((s) => s.id === id);
    await apiUpdateService(id, { ...serviceToUpdate, [champ]: valeur });
    fetchData();
  };

  const supprimerService = async (id) => {
    await apiDeleteService(id);
    fetchData();
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Admin InkMaster {isMock ? '(mode mock)' : ''}</h1>

      {erreur && <p className="error">{erreur}</p>}

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
          <button type="submit" disabled={isCreatingUser}>
            {isCreatingUser ? "Création..." : "Créer"}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Rôle</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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

      <section>
        <h2>Tatouages</h2>
        <form onSubmit={(e) => { e.preventDefault(); creerTattoo(); }}>
          <input placeholder="Titre" value={newTattoo.titre} onChange={(e) => setNewTattoo({ ...newTattoo, titre: e.target.value })} />
          <input placeholder="Description" value={newTattoo.description} onChange={(e) => setNewTattoo({ ...newTattoo, description: e.target.value })} />
          <input placeholder="Image URL" value={newTattoo.image} onChange={(e) => setNewTattoo({ ...newTattoo, image: e.target.value })} />
          <input placeholder="ID Artiste" value={newTattoo.id_utilisateur} onChange={(e) => setNewTattoo({ ...newTattoo, id_utilisateur: e.target.value })} />
          <button type="submit" disabled={isCreatingTattoo}>
            {isCreatingTattoo ? "Création..." : "Créer"}
          </button>
        </form>

        <table>
          <thead>
            <tr><th>ID</th><th>Titre</th><th>Description</th><th>Image</th><th>Artiste</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tattoos.map((t) => (
              <tr key={t.id || t.id_tatouage}>
                <td>{t.id || t.id_tatouage}</td>
                <td><input value={t.titre} onChange={(e) => modifierTattoo(t.id || t.id_tatouage, 'titre', e.target.value)} /></td>
                <td><input value={t.description} onChange={(e) => modifierTattoo(t.id || t.id_tatouage, 'description', e.target.value)} /></td>
                <td><img src={t.image} alt={t.titre} /><br />
                    <input value={t.image} onChange={(e) => modifierTattoo(t.id || t.id_tatouage, 'image', e.target.value)} />
                </td>
                <td><input value={t.id_utilisateur} onChange={(e) => modifierTattoo(t.id || t.id_tatouage, 'id_utilisateur', e.target.value)} /></td>
                <td><button onClick={() => supprimerTattoo(t.id || t.id_tatouage)}>Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Services</h2>
        <form onSubmit={(e) => { e.preventDefault(); creerService(); }}>
          <input placeholder="Nom" value={newService.nom} onChange={(e) => setNewService({ ...newService, nom: e.target.value })} />
          <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
          <button type="submit" disabled={isCreatingService}>
            {isCreatingService ? "Création..." : "Créer"}
          </button>
        </form>

        <table>
          <thead><tr><th>ID</th><th>Nom</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map((s) => (
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
