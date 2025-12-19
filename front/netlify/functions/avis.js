const { shared, json, nextId } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {});

  if (event.httpMethod === 'GET') {
    return json(200, shared.avis.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const id = nextId(shared.avis);
    const avis = { id, email: body.email || 'anonyme', message: body.message || '', rating: Number(body.rating) || 0, createdAt: new Date().toISOString() };
    shared.avis.unshift(avis);
    return json(201, avis);
  }

  if (event.httpMethod === 'DELETE') {
    const id = Number(event.queryStringParameters?.id);
    const idx = shared.avis.findIndex((a) => a.id === id);
    if (idx !== -1) shared.avis.splice(idx, 1);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
};
