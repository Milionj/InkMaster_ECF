const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const MUTATING_METHODS = ['post', 'put', 'patch', 'delete'];

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

export function attachCsrfHeader(config) {
  const method = (config.method || 'get').toLowerCase();
  if (!MUTATING_METHODS.includes(method)) return config;

  const token = getCookie(CSRF_COOKIE_NAME);
  if (token) {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
}
