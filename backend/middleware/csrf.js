import crypto from 'crypto';
import { AUTH_COOKIE_NAME } from './verifyToken.js';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Middleware de validation CSRF (double-submit cookie).
 * Nécessite un cookie d'auth présent : sans cookie, pas de surface CSRF.
 */
export function csrfProtection(req, res, next) {
  if (SAFE_METHODS.includes(req.method)) return next();

  const hasAuthCookie = Boolean(req.cookies?.[AUTH_COOKIE_NAME]);
  if (!hasAuthCookie) return next();

  const headerToken = req.get('X-CSRF-Token');
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ message: 'Token CSRF manquant ou invalide' });
  }

  return next();
}

export function buildCsrfCookieOptions() {
  return {
    httpOnly: false, // doit être lisible côté client pour l'en-tête
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export const CSRF_COOKIE_NAME_CONST = CSRF_COOKIE_NAME;
