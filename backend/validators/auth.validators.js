import { body } from 'express-validator';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),
  body('password')
    .matches(strongPasswordRegex)
    .withMessage("Mot de passe trop faible"),
  body('captchaToken')
    .isString()
    .withMessage("Token reCAPTCHA manquant")
    .notEmpty()
    .withMessage("Token reCAPTCHA requis"),
];
