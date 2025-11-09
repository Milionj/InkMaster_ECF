import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6, max: 128 }).withMessage("Mot de passe invalide"),
  body('captchaToken')
    .isString().withMessage("Token reCAPTCHA manquant")
    .notEmpty().withMessage("Token reCAPTCHA requis"),
];
