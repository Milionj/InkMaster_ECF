import { useState } from 'react'; // pour gerer l'état local (email, mot de passe, erreur)
import axios from 'axios'; // faire la requete HTTP POST vers le backend 
import { useNavigate } from 'react-router-dom'; //rediriger apres la connexion
import './Login.css';

export default function Login () {
    //etat pour stocker les donnée saisies dans le formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erreur, setErreur] = useState('');

    const navigate = useNavigate(); // pour rediriger vers une autre page

    // connexion

    const handleLogin = async (e) => {
        e.preventDefault(); //empeche le rechargement de la page au click submit

        try {
            //requete POST envoyée a l'API backend avec l'email et le mot de passe
            const res = await axios.post('http://localhost:3001/login',{
                email,
                password
            });

            //on recupere le token avec le role envoyé a l'API

            const { token, role } = res.data;

            //on stock ces donnée dans le localStorage pour le utiliser plus tard
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // connexion si admin vers dashboard

            if (role === 'admin') {
                navigate('/dashboard');
            } else {
            setErreur("Accèes refusé : réservé a l'administrateur.");
        }
    } catch (err) {
        setErreur("Email ou mot de passe incorrect.");
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

        <button type="submit">Connexion</button>

        {/* Affiche un message d’erreur si nécessaire */}
        {erreur && <p className="error-msg">{erreur}</p>}
      </form>
    </div>
  );
}