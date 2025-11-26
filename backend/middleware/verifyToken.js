import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const AUTH_COOKIE_NAME = 'inkmaster_token';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  const token = bearerToken || cookieToken;

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'inkmasterSecretKey');
    req.user = decoded; // ex: { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
}

/** Exécute les validations puis renvoie 400 si erreurs */
export const validate = (validators) => async (req, res, next) => {
  await Promise.all(validators.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map((e) => ({ field: e.param, msg: e.msg })),
    });
  }
  next();
};

export function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
}
