import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export function verifyToken(req, res, next) {
  // 1)  essaie d'abord le cookie httpOnly posé au login
  let token = req.cookies?.auth_token;

  // 2) Fallback : ancien système "Authorization: Bearer xxx"
  if (!token) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Format de token invalide' });
    }
    token = parts[1];
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'inkmasterSecretKey'
    );
    // ex: { id, role }
    req.user = decoded;
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
