const { shared, json } = require('./utils');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {});

  if (event.httpMethod === 'GET') {
    return json(200, shared.tattoos);
  }

  return json(405, { error: 'Method not allowed' });
};
