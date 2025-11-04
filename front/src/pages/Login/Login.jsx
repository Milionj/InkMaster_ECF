import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useUser } from "../../context/UserContext";
import "./Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const { login } = useUser();
  // États pour stocker les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  // États pour les messages d’erreur
  const [erreur, setErreur] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Ref pour pouvoir reset le reCAPTCHA après soumission
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // Fonction pour vérifier que l’email est valide
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Fonction pour vérifier que le mot de passe est valide (lettres + chiffres, au moins 6 caractères)
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  // Fonction déclenchée lors de la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();

    // Si le reCAPTCHA n’a pas été validé, on empêche l’envoi
    if (!captchaToken) {
      setErreur("Veuillez valider le reCAPTCHA.");
      return;
    }

    // Vérification du format de l’email
    if (!validateEmail(email)) {
      setEmailError("Format d'email invalide.");
      return;
    } else {
      setEmailError("");
    }

    // Vérification du format du mot de passe
    if (!validatePassword(password)) {
      setPasswordError(
        "Mot de passe invalide : au moins 6 caractères avec lettres et chiffres"
      );
      return;
    } else {
      setPasswordError("");
    }

    // Affiche le token reCAPTCHA dans la console pour le debug
    console.log("Token captcha envoyé au backend :", captchaToken);

    try {
      // Envoie des données de connexion + token captcha au backend
      const res = await axios.post(
        "http://localhost:5000/api/utilisateurs/login",
        {
          email,
          password,
          captchaToken,
        }
      );

      // Si la connexion réussit, on stocke le token JWT et le rôle dans le localStorage
      const { token, role } = res.data;

      // a verifier
      // ------------------------------------------------------------------------------------------------
      // Connexion à Firebase Auth en parallèle du backend
      // const firebaseAuth = getAuth();
      // await signInWithEmailAndPassword(firebaseAuth, email, password);

      login(token, role);

      // Redirection selon le rôle
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "artiste") {
        navigate("/");
      } else {
        setErreur("Rôle inconnu.");
      }
    } catch (err) {
      console.error(err);
      // Si c’est une erreur liée au captcha, on affiche un message spécifique
      if (err.response?.data?.message === "Captcha invalide") {
        setErreur("Captcha invalide. Merci de cocher à nouveau.");
      } else {
        setErreur("Email ou mot de passe incorrect.");
      }
    }

    // On reset le reCAPTCHA pour permettre une nouvelle tentative
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setCaptchaToken(""); // On remet l’état à vide
    }
  };

  return (
    <div className="login-page">
      <h1>Connexion</h1>

      <form onSubmit={handleLogin} className="login-box">
        <label>Email</label>
        <input
          type="email"
          placeholder="email valide"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="error-msg">{emailError}</p>}

        <label>Mot de passe</label>
        <input
          type="password"
          placeholder="mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <p className="error-msg">{passwordError}</p>}

        {/* Composant reCAPTCHA : on récupère le token dès que l’utilisateur coche la case */}
        <ReCAPTCHA
          sitekey="6LeMsvgrAAAAAGruIo9rqL21gxZB7Mmhr9CJ9rK6"
          onChange={(token) => {
            console.log("Token reCAPTCHA reçu :", token);
            setCaptchaToken(token);
          }}
          ref={recaptchaRef}
        />

        <button type="submit">Connexion</button>

        {/* Affichage d’un message d’erreur global si besoin */}
        {erreur && <p className="error-msg">{erreur}</p>}
      </form>
    </div>
  );
}
