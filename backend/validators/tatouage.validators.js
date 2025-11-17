import { body, param } from 'express-validator';

export const createTattooValidator = [
  body('titre')
    .isString()
    .isLength({ min: 1, max: 120 })
    .withMessage('Titre requis'),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 5000 }),
  body('image')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Image requise'),
  body('id_utilisateur')
    .isInt()
    .withMessage('id_utilisateur doit être un entier'),
];

export const updateTattooValidator = [
  param('id')
    .isInt()
    .withMessage('Param id invalide'),
  body('titre')
    .optional()
    .isString()
    .isLength({ min: 1, max: 120 }),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 5000 }),
  body('image')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 }),
];

export const tattooIdParam = [
  param('id').isInt().withMessage('Param id invalide'),
];
