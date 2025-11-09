import { body, param } from 'express-validator';

export const createServiceValidator = [
  body('nom').isString().isLength({ min: 1, max: 120 }).withMessage('Nom requis'),
  body('description').optional().isString().isLength({ max: 5000 }),
  body('images').optional().isArray().withMessage('images doit être un tableau'),
];

export const updateServiceValidator = [
  param('id').isInt().withMessage('Param id invalide'),
  body('nom').optional().isString().isLength({ min: 1, max: 120 }),
  body('description').optional().isString().isLength({ max: 5000 }),
  body('images').optional().isArray(),
];
