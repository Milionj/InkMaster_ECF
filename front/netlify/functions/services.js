const { shared, json, nextId } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {});

  if (event.httpMethod === 'GET') {
    return json(200, shared.services);
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const id = nextId(shared.services);
    const service = { id, nom: body.nom || 'Service', description: body.description || '' };
    shared.services.push(service);
    return json(201, service);
  }

  if (event.httpMethod === 'PUT') {
    const id = Number(event.queryStringParameters?.id);
    const body = JSON.parse(event.body || '{}');
    const idx = shared.services.findIndex((s) => s.id === id);
    if (idx === -1) return json(404, { error: 'Not found' });
    shared.services[idx] = { ...shared.services[idx], ...body };
    return json(200, shared.services[idx]);
  }

  if (event.httpMethod === 'DELETE') {
    const id = Number(event.queryStringParameters?.id);
    const idx = shared.services.findIndex((s) => s.id === id);
    if (idx !== -1) shared.services.splice(idx, 1);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
};
