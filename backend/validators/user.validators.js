import { body, param } from 'express-validator';

export const createUserValidator = [
  body('nom').isString().isLength({ min: 1, max: 120 }),
  body('prenom').isString().isLength({ min: 1, max: 120 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8, max: 128 }),
  body('role').isIn(['admin','artiste','employe']).withMessage('Rôle invalide'),
];

export const userIdParam = [ param('id').isInt().withMessage('Param id invalide') ];
