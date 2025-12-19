const { shared, json, nextId } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {});

  if (event.httpMethod === 'GET') {
    return json(200, shared.rendezVous.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const id = nextId(shared.rendezVous);
    const rdv = {
      id,
      nom: body.nom || 'Client',
      email: body.email || 'inconnu@example.com',
      telephone: body.telephone || '',
      date: body.date || '',
      heure: body.heure || '',
      message: body.message || '',
      statut: 'en_attente',
      createdAt: new Date().toISOString()
    };
    shared.rendezVous.unshift(rdv);
    return json(201, rdv);
  }

  if (event.httpMethod === 'PUT') {
    const id = Number(event.queryStringParameters?.id);
    const body = JSON.parse(event.body || '{}');
    const idx = shared.rendezVous.findIndex((r) => r.id === id);
    if (idx === -1) return json(404, { error: 'Not found' });
    shared.rendezVous[idx] = { ...shared.rendezVous[idx], ...body };
    return json(200, shared.rendezVous[idx]);
  }

  if (event.httpMethod === 'DELETE') {
    const id = Number(event.queryStringParameters?.id);
    const idx = shared.rendezVous.findIndex((r) => r.id === id);
    if (idx !== -1) shared.rendezVous.splice(idx, 1);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
};
