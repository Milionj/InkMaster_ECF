import { sanitizeFields } from '../security/sanitize.js';

// nettoie (sanitize) des champs dans req.body
export const sanitizeBody = (fields, cfg) => (req, _res, next) => {
  sanitizeFields(req.body, fields, cfg);
  next();
};
// nettoie des champs dans req.params
export const sanitizeParams = (fields, cfg) => (req, _res, next) => {
  sanitizeFields(req.params, fields, cfg);
  next();
};
