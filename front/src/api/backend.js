import axios from 'axios';
import { attachCsrfHeader } from './csrf.js';

// Par défaut on force le mock pour éviter tout appel localhost ou CORS
const useMock = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/.netlify/functions';

const api = axios.create({ baseURL: apiBaseURL, withCredentials: true });
api.interceptors.request.use(attachCsrfHeader);

const STORAGE_KEY = 'inkmaster-mock-db';
const MOCK_VERSION = 5;
const isNetlifyHost = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');

const now = () => new Date().toISOString();

const defaultState = {
  version: MOCK_VERSION,
  sessionUserId: null,
  users: [
    { id: 15, role: 'admin', email: 'admin@inkmaster.com', nom: 'Admin', prenom: 'Principal', password: 'Password123!' },
    { id: 16, role: 'artiste', email: 'webs@inkmaster.com', nom: 'Webs', prenom: 'Tatoueur', password: 'Password123!' },
    { id: 17, role: 'artiste', email: 'jade@inkmaster.com', nom: 'Jade', prenom: 'Tatoueuse', password: 'Password123!' },
    { id: 18, role: 'artiste', email: 'crusher@inkmaster.com', nom: 'Crusher', prenom: 'Tatoueur/Perceur', password: 'Password123!' }
  ],
  tattoos: [
    { id: 1, id_tatouage: 1, id_utilisateur: 16, titre: 'Ghost Never Die', image: 'ghostneverdie.JPG', description: 'Ombres et revenants' },
    { id: 2, id_tatouage: 2, id_utilisateur: 16, titre: 'Poisson Sacré', image: 'luther_poisson.JPG', description: "Symbole aquatique sur l'épaule" },
    { id: 3, id_tatouage: 3, id_utilisateur: 16, titre: 'Goranes dos', image: 'Goranes_dos.jpg', description: 'Vue dos du Goranes' },
    { id: 4, id_tatouage: 4, id_utilisateur: 16, titre: 'Goranes dos fini', image: 'Goranes_dos_fini.jpg', description: 'Version finale du tatouage dos' },
    { id: 5, id_tatouage: 5, id_utilisateur: 17, titre: 'Regard Céleste', image: 'RegardCéleste.webp', description: 'Un œil universel' },
    { id: 6, id_tatouage: 6, id_utilisateur: 17, titre: 'Animal Tribal', image: 'tribal_Animal.webp', description: 'Force et spiritualité tribale' },
    { id: 7, id_tatouage: 7, id_utilisateur: 18, titre: 'Tatouage Maison', image: 'Maison.jpg', description: 'Croix décorée sur la peau' },
    { id: 8, id_tatouage: 8, id_utilisateur: 18, titre: 'Goranes', image: 'Goranes.jpg', description: 'Tatouage BD stylisé' },
    { id: 10, id_tatouage: 10, id_utilisateur: 18, titre: 'the House', image: 'housetatoo.png', description: 'the house tha jack build' }
  ],
  services: [
    { id: 1, nom: 'Tatouage sur mesure', description: 'Création originale adaptée à votre peau.' },
    { id: 2, nom: 'Cover & retouche', description: 'On sublime ou on répare un ancien tattoo.' },
    { id: 3, nom: 'Conseil projet', description: '30 minutes pour cadrer votre futur motif.' }
  ],
  avis: [
    { id: 1, email: 'lena@example.com', message: 'Super accueil, conseils clairs et hygiène top !', rating: 5, createdAt: now() },
    { id: 2, email: 'marc@example.com', message: 'Premier tattoo, équipe rassurante et très pro.', rating: 4, createdAt: now() },
    { id: 3, email: 'ines@example.com', message: 'Jade a fait un trait ultra fin, je recommande.', rating: 5, createdAt: now() }
  ],
  rendezVous: [
    { id: 1, nom: 'Paul', email: 'paul@example.com', telephone: '+33611223344', date: '2025-12-10', heure: '15:30', message: 'Projet géométrique avant-bras.', statut: 'en_attente', createdAt: now() },
    { id: 2, nom: 'Emma', email: 'emma@example.com', telephone: '+33655667788', date: '2025-12-12', heure: '11:00', message: 'Cover up old tattoo.', statut: 'confirme', createdAt: now() }
  ]
};

const clone = (data) => JSON.parse(JSON.stringify(data));

function loadMockState() {
  const base = clone(defaultState);
  if (typeof localStorage === 'undefined') return base;

  if (isNetlifyHost) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Impossible de purger le mock', err);
    }
    return base;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.version === MOCK_VERSION) {
        return { ...base, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Mock storage inaccessible, fallback to defaults', err);
  }
  return base;
}

function persist(state) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: MOCK_VERSION }));
  } catch (err) {
    console.warn('Impossible de persister le mock', err);
  }
}

const mockDb = loadMockState();

const withDelay = (result, ms = 120) => new Promise((resolve) => setTimeout(() => resolve(clone(result)), ms));

const findUserByEmail = (email) => mockDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
const nextId = (collection) => collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

// ---- MOCK IMPLEMENTATION ----
const mockApi = {
  async login(email, password) {
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    mockDb.sessionUserId = user.id;
    persist(mockDb);
    return withDelay({ user: clone(user) });
  },

  async logout() {
    mockDb.sessionUserId = null;
    persist(mockDb);
    return withDelay({ success: true });
  },

  async me() {
    const user = mockDb.users.find((u) => u.id === mockDb.sessionUserId);
    if (!user) throw new Error('Not authenticated');
    return withDelay(clone(user));
  },

  async listUsers() {
    return withDelay(clone(mockDb.users));
  },

  async createUser(payload) {
    const id = nextId(mockDb.users);
    const user = { id, ...payload };
    mockDb.users.push(user);
    persist(mockDb);
    return withDelay(clone(user));
  },

  async updateUser(id, payload) {
    const idx = mockDb.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');
    mockDb.users[idx] = { ...mockDb.users[idx], ...payload };
    persist(mockDb);
    return withDelay(clone(mockDb.users[idx]));
  },

  async deleteUser(id) {
    mockDb.users.splice(mockDb.users.findIndex((u) => u.id === id), 1);
    persist(mockDb);
    return withDelay({ success: true });
  },

  async listTatouages() {
    return withDelay(clone(mockDb.tattoos));
  },

  async listTatouagesPublic() {
    const enriched = mockDb.tattoos.map((t) => {
      const artist = mockDb.users.find((u) => u.id === t.id_utilisateur);
      return {
        ...t,
        prenom_artiste: artist?.prenom || 'InkMaster',
        nom_artiste: artist?.nom || ''
      };
    });
    return withDelay(enriched);
  },

  async listTatouagesByUser(userId) {
    return withDelay(mockDb.tattoos.filter((t) => Number(t.id_utilisateur) === Number(userId)));
  },

  async createTatouage(payload) {
    const id = nextId(mockDb.tattoos);
    const tattoo = { id, id_tatouage: id, ...payload };
    mockDb.tattoos.push(tattoo);
    persist(mockDb);
    return withDelay(clone(tattoo));
  },

  async updateTatouage(id, payload) {
    const idx = mockDb.tattoos.findIndex((t) => t.id === id || t.id_tatouage === id);
    if (idx === -1) throw new Error('Tattoo not found');
    mockDb.tattoos[idx] = { ...mockDb.tattoos[idx], ...payload };
    persist(mockDb);
    return withDelay(clone(mockDb.tattoos[idx]));
  },

  async deleteTatouage(id) {
    const idx = mockDb.tattoos.findIndex((t) => t.id === id || t.id_tatouage === id);
    if (idx !== -1) mockDb.tattoos.splice(idx, 1);
    persist(mockDb);
    return withDelay({ success: true });
  },

  async listServices() {
    return withDelay(clone(mockDb.services));
  },

  async createService(payload) {
    const id = nextId(mockDb.services);
    const service = { id, ...payload };
    mockDb.services.push(service);
    persist(mockDb);
    return withDelay(clone(service));
  },

  async updateService(id, payload) {
    const idx = mockDb.services.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Service not found');
    mockDb.services[idx] = { ...mockDb.services[idx], ...payload };
    persist(mockDb);
    return withDelay(clone(mockDb.services[idx]));
  },

  async deleteService(id) {
    const idx = mockDb.services.findIndex((s) => s.id === id);
    if (idx !== -1) mockDb.services.splice(idx, 1);
    persist(mockDb);
    return withDelay({ success: true });
  },

  async listAvis() {
    return withDelay(clone(mockDb.avis).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },

  async createAvis(payload) {
    const id = nextId(mockDb.avis);
    const avis = { id, ...payload, createdAt: now() };
    mockDb.avis.unshift(avis);
    persist(mockDb);
    return withDelay(clone(avis));
  },

  async deleteAvis(id) {
    const idx = mockDb.avis.findIndex((a) => a.id === id);
    if (idx !== -1) mockDb.avis.splice(idx, 1);
    persist(mockDb);
    return withDelay({ success: true });
  },

  async listRendezVous() {
    return withDelay(clone(mockDb.rendezVous).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },

  async createRendezVous(payload) {
    const id = nextId(mockDb.rendezVous);
    const rdv = { id, statut: 'en_attente', createdAt: now(), ...payload };
    mockDb.rendezVous.unshift(rdv);
    persist(mockDb);
    return withDelay(clone(rdv));
  },

  async updateRendezVous(id, payload) {
    const idx = mockDb.rendezVous.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('RDV not found');
    mockDb.rendezVous[idx] = { ...mockDb.rendezVous[idx], ...payload };
    persist(mockDb);
    return withDelay(clone(mockDb.rendezVous[idx]));
  },

  async deleteRendezVous(id) {
    const idx = mockDb.rendezVous.findIndex((r) => r.id === id);
    if (idx !== -1) mockDb.rendezVous.splice(idx, 1);
    persist(mockDb);
    return withDelay({ success: true });
  }
};

// ---- PUBLIC API ----
export const isMock = useMock;

export async function login(email, password, captchaToken) {
  if (useMock) return mockApi.login(email, password, captchaToken).then((r) => r.user);
  const { data } = await api.post('/api/utilisateurs/login', { email, password, captchaToken });
  return data.user;
}

export async function logout() {
  if (useMock) return mockApi.logout();
  await api.post('/api/utilisateurs/logout');
}

export async function fetchProfile() {
  if (useMock) return mockApi.me();
  const { data } = await api.get('/api/utilisateurs/me');
  return data;
}

export async function fetchUsers() {
  if (useMock) return mockApi.listUsers();
  const { data } = await api.get('/api/utilisateurs');
  return data;
}

export async function createUser(payload) {
  if (useMock) return mockApi.createUser(payload);
  const { data } = await api.post('/api/utilisateurs', payload);
  return data;
}

export async function updateUser(id, payload) {
  if (useMock) return mockApi.updateUser(id, payload);
  const { data } = await api.put(`/api/utilisateurs/${id}`, payload);
  return data;
}

export async function deleteUser(id) {
  if (useMock) return mockApi.deleteUser(id);
  const { data } = await api.delete(`/api/utilisateurs/${id}`);
  return data;
}

export async function fetchTatouagesPublic() {
  if (useMock) return mockApi.listTatouagesPublic();
  const { data } = await api.get('/api/tatouages/public');
  return data;
}

export async function fetchTatouagesAdmin() {
  if (useMock) return mockApi.listTatouages();
  const { data } = await api.get('/api/tatouages');
  return data;
}

export async function fetchTatouagesByUser(userId) {
  if (useMock) return mockApi.listTatouagesByUser(userId);
  const { data } = await api.get(`/api/utilisateurs/${userId}/tatouages`);
  return data;
}

export async function createTatouage(payload) {
  if (useMock) return mockApi.createTatouage(payload);
  const { data } = await api.post('/api/tatouages', payload);
  return data;
}

export async function updateTatouage(id, payload) {
  if (useMock) return mockApi.updateTatouage(id, payload);
  const { data } = await api.put(`/api/tatouages/${id}`, payload);
  return data;
}

export async function deleteTatouage(id) {
  if (useMock) return mockApi.deleteTatouage(id);
  const { data } = await api.delete(`/api/tatouages/${id}`);
  return data;
}

export async function fetchServices() {
  if (useMock) return mockApi.listServices();
  const { data } = await api.get('/api/services');
  return data;
}

export async function createService(payload) {
  if (useMock) return mockApi.createService(payload);
  const { data } = await api.post('/api/services', payload);
  return data;
}

export async function updateService(id, payload) {
  if (useMock) return mockApi.updateService(id, payload);
  const { data } = await api.put(`/api/services/${id}`, payload);
  return data;
}

export async function deleteService(id) {
  if (useMock) return mockApi.deleteService(id);
  const { data } = await api.delete(`/api/services/${id}`);
  return data;
}

export async function fetchAvis() {
  if (useMock) return mockApi.listAvis();
  return [];
}

export async function createAvis(payload) {
  if (useMock) return mockApi.createAvis(payload);
  return { success: false };
}

export async function deleteAvis(id) {
  if (useMock) return mockApi.deleteAvis(id);
  return { success: false };
}

export async function fetchRendezVous() {
  if (useMock) return mockApi.listRendezVous();
  return [];
}

export async function createRendezVous(payload) {
  if (useMock) return mockApi.createRendezVous(payload);
  return { success: false };
}

export async function updateRendezVous(id, payload) {
  if (useMock) return mockApi.updateRendezVous(id, payload);
  return { success: false };
}

export async function deleteRendezVous(id) {
  if (useMock) return mockApi.deleteRendezVous(id);
  return { success: false };
}

export function getApiBaseURL() {
  return apiBaseURL;
}
