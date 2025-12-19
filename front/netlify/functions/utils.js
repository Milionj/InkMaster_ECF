const shared = {
  users: [
    { id: 15, role: 'admin', email: 'admin@inkmaster.com', nom: 'Admin', prenom: 'Principal' },
    { id: 16, role: 'artiste', email: 'webs@inkmaster.com', nom: 'Webs', prenom: 'Tatoueur' },
    { id: 17, role: 'artiste', email: 'jade@inkmaster.com', nom: 'Jade', prenom: 'Tatoueuse' },
    { id: 18, role: 'artiste', email: 'crusher@inkmaster.com', nom: 'Crusher', prenom: 'Tatoueur/Perceur' }
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
    { id: 1, email: 'lena@example.com', message: 'Super accueil, conseils clairs et hygiène top !', rating: 5, createdAt: new Date().toISOString() },
    { id: 2, email: 'marc@example.com', message: 'Premier tattoo, équipe rassurante et très pro.', rating: 4, createdAt: new Date().toISOString() },
    { id: 3, email: 'ines@example.com', message: 'Jade a fait un trait ultra fin, je recommande.', rating: 5, createdAt: new Date().toISOString() }
  ],
  rendezVous: [
    { id: 1, nom: 'Paul', email: 'paul@example.com', telephone: '+33611223344', date: '2025-12-10', heure: '15:30', message: 'Projet géométrique avant-bras.', statut: 'en_attente', createdAt: new Date().toISOString() },
    { id: 2, nom: 'Emma', email: 'emma@example.com', telephone: '+33655667788', date: '2025-12-12', heure: '11:00', message: 'Cover up old tattoo.', statut: 'confirme', createdAt: new Date().toISOString() }
  ]
};

const nextId = (arr) => arr.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0) + 1;
const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(body)
});

module.exports = { shared, nextId, json };
