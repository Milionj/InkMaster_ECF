import { body, param } from 'express-validator';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

export const createUserValidator = [
  body('nom').isString().isLength({ min: 1, max: 120 }),
  body('prenom').isString().isLength({ min: 1, max: 120 }),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .matches(strongPasswordRegex)
    .withMessage('Mot de passe trop faible'),
  body('role').isIn(['admin', 'artiste', 'employe']),
];

export const updateUserValidator = [
  param('id').isInt(),
  body('nom').optional().isString().isLength({ min: 1, max: 120 }),
  body('prenom').optional().isString().isLength({ min: 1, max: 120 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['admin', 'artiste', 'employe']),
];

export const userIdParam = [param('id').isInt()];
