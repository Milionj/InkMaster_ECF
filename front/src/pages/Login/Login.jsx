import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useUser } from "../../Context/UserContext";
import "./Login.css";

export default function Login() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [erreur, setErreur] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(value);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    alert("Si vous voulez vous connecter à ce site veuillez me contacter via : www.linkedin.com/in/serge-weber-b414b3232 , mes infos sur : https://sergeweberportfolio.netlify.app/ .");

    if (!captchaToken) {
      setErreur("Veuillez valider le reCAPTCHA.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Format d'email invalide.");
      return;
    }
    setEmailError("");

    if (!validatePassword(password)) {
      setPasswordError("Mot de passe invalide !");
      return;
    }
    setPasswordError("");

    setIsSubmitting(true);

    try {
      const user = await login(email, password, captchaToken);
      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "artiste") {
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
    } finally {
      setIsSubmitting(false);
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
          onChange={(token) => setCaptchaToken(token || "")}
          ref={recaptchaRef}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Connexion"}
        </button>

        {erreur && <p className="error-msg">{erreur}</p>}
      </form>
    </div>
  );
}
