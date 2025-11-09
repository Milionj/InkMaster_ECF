import { body, param } from 'express-validator';

export const createServiceValidator = [
  body('nom').isString().isLength({ min: 1, max: 120 }),
  body('description').optional().isString().isLength({ max: 5000 }),
];

export const updateServiceValidator = [
  param('id').isInt(),
  body('nom').optional().isString().isLength({ min: 1, max: 120 }),
  body('description').optional().isString().isLength({ max: 5000 }),
];

export const serviceIdParam = [ param('id').isInt() ];
