import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase"; 
import { useAuth } from "../../Context/AuthContext"; // Si tu veux déclencher le contexte
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [erreur, setErreur] = useState('');
    const recaptchaRef = useRef(null); // Ajoute un useRef pour le recaptcha
    const auth = getAuth(app);

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return regex.test(password);
    };

   const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
        setErreur("Email invalide");
        return;
    }

    if (!validatePassword(password)) {
        setErreur("Mot de passe invalide : au moins 6 caractères avec lettres et chiffres");
        return;
    }

    try {
        // 🔐 Auth backend Node (captcha + JWT)
        const res = await axios.post('http://localhost:5000/api/utilisateurs/login', { 
            email,
            password,
            captchaToken
        });

        const { token, role } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // 🔑 Auth Firebase (pour Firestore + CommentsSection)
        await signInWithEmailAndPassword(auth, email, password);

        // 🎯 Redirection après double connexion
        if (role === 'admin') {
            navigate('/dashboard');
        } else if (role === 'artiste') {
            navigate('/');
        } else {
            setErreur("Rôle inconnu.");
        }

    } catch (err) {
        console.error(err);
        setErreur("Email ou mot de passe incorrect ou utilisateur Firebase manquant.");
    }

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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Mot de passe</label>
                <input
                    type="password"
                    placeholder="mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

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
