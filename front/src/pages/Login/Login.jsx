import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import './Login.css';

export default function Login() {
    // États pour les champs de formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    // États pour les messages d'erreur
    const [erreur, setErreur] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const recaptchaRef = useRef(null); // Permet de reset le captcha après soumission
    const navigate = useNavigate();

    // Vérifie que l'email est bien au bon format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    

    // Vérifie que le mot de passe contient au moins 6 caractères avec lettres et chiffres
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        return regex.test(password);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Vérification du format email
        if (!validateEmail(email)) {
            setEmailError("Format d'email invalide.");
            return;
        } else {
            setEmailError('');
        }

        // Vérification du format mot de passe
        if (!validatePassword(password)) {
            setPasswordError("Mot de passe invalide : au moins 6 caractères avec lettres et chiffres");
            return;
        } else {
            setPasswordError('');
        }

        try {
            // Envoie des données au backend : email, mdp et token captcha
            const res = await axios.post('http://localhost:5000/api/utilisateurs/login', { 
                email,
                password,
                captchaToken
            });

            const { token, role } = res.data;

            // Stocke le token JWT et le rôle en local
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirection en fonction du rôle
            if (role === 'admin') {
                navigate('/dashboard');
            } else if (role === 'artiste') {
                navigate('/'); // Redirection vers la page publique pour les artistes
            } else {
                setErreur("Rôle inconnu.");
            }

        } catch (err) {
            console.error(err);
            setErreur("Email ou mot de passe incorrect.");
        }

        // Réinitialise le captcha après tentative
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
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
                    onChange={(e) => { 
                        const val = e.target.value; 
                        setEmail(val);
                        if (!validateEmail(val)) {
                            setEmailError("Format d'email invalide.");
                        } else {
                            setEmailError('');
                        }
                    }}
                    required
                />
                {emailError && <p className="error-msg">{emailError}</p>}

                <label>Mot de passe</label>
                <input
                    type="password"
                    placeholder="mot de passe"
                    value={password}
                    onChange={(e) => { 
                        const val = e.target.value;
                        setPassword(val);
                        if (!validatePassword(val)) {
                            setPasswordError("Mot de passe : au moins 6 caractères avec lettres et chiffres");
                        } else {
                            setPasswordError('');
                        }
                    }}
                    required
                />
                {passwordError && <p className="error-msg">{passwordError}</p>}

                {/* Lors du clic sur "Connexion", le reCAPTCHA génère un token temporaire.
                    Ce token est envoyé avec l'email et le mot de passe dans la requête vers le backend.
                    Le backend valide ce token grâce à l'API Google reCAPTCHA côté serveur. */}
                <ReCAPTCHA
                    sitekey="6LeKCXUrAAAAAJhnN1D87kWMfZ0wlLD_J7uujRmm"
                    onChange={(token) => setCaptchaToken(token)}
                    ref={recaptchaRef}
                />

                <button type="submit">Connexion</button>

                {erreur && <p className="error-msg">{erreur}</p>}
            </form>
        </div>
    );
}
