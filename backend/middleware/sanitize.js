import { sanitizeFields } from '../security/sanitize.js';

export const sanitizeBody = (fields, cfg) => (req, _res, next) => {
  sanitizeFields(req.body, fields, cfg);
  next();
};
export const sanitizeParams = (fields, cfg) => (req, _res, next) => {
  sanitizeFields(req.params, fields, cfg);
  next();
};
