import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Par défaut: aucune balise/attribut autorisés (texte brut)
const defaultCfg = { ALLOWED_TAGS: [], ALLOWED_ATTR: [] };

export const cleanString = (val, cfg = defaultCfg) => {
  if (typeof val !== 'string') return val;
  return DOMPurify.sanitize(val, cfg).trim();
};

export const sanitizeFields = (obj, fields, cfg = defaultCfg) => {
  if (!obj) return;
  for (const f of fields) {
    if (obj[f] !== undefined && obj[f] !== null) {
      obj[f] = cleanString(String(obj[f]), cfg);
    }
  }
};
