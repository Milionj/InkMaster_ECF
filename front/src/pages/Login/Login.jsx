import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useUser } from "../../context/UserContext";
import "./Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const [erreur, setErreur] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // Vérification email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Mot de passe fort : 12 caractères min, maj, min, chiffre, caractère spécial
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!captchaToken) {
      setErreur("Veuillez valider le reCAPTCHA.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Format d'email invalide.");
      return;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Mot de passe invalide : minimum 12 caractères avec majuscule, minuscule, chiffre et caractère spécial."
      );
      return;
    } else {
      setPasswordError("");
    }

    console.log("Token captcha envoyé au backend :", captchaToken);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/utilisateurs/login",
        {
          email,
          password,
          captchaToken,
        },
        {
          withCredentials: true, // IMPORTANT pour recevoir le cookie httpOnly
        }
      );

      // Le backend renvoie seulement le rôle (le token est dans le cookie)
      const { role } = res.data;

      // Optionnel : login Firebase si je veux synchroniser
      // const firebaseAuth = getAuth();
      // await signInWithEmailAndPassword(firebaseAuth, email, password);

      // On met à jour le contexte (pas de token côté front)
      login(role);

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
      if (err.response?.data?.message === "Captcha invalide") {
        setErreur("Captcha invalide. Merci de cocher à nouveau.");
      } else {
        setErreur("Email ou mot de passe incorrect.");
      }
    }

    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setCaptchaToken("");
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

        <ReCAPTCHA
          sitekey="6LeMsvgrAAAAAGruIo9rqL21gxZB7Mmhr9CJ9rK6"
          onChange={(token) => {
            console.log("Token reCAPTCHA reçu :", token);
            setCaptchaToken(token);
          }}
          ref={recaptchaRef}
        />

        <button type="submit">Connexion</button>

        {erreur && <p className="error-msg">{erreur}</p>}
      </form>
    </div>
  );
}
