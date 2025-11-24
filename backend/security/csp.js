const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/ https://www.google.com",
  "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/ https://www.google.com/maps/",
  "connect-src 'self' http://localhost:5000 ws://localhost:5173 https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.recaptcha.net/recaptcha/",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

export const getContentSecurityPolicy = () => cspDirectives.join('; ');
