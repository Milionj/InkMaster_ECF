import { createContext, useState, useEffect } from "react";

//création du contexte utilisateur qui peut etre importé ailleurs

export const UserContext = createContext();

//composant qui fourni le contexte a toute l'application

export const UserProvider = ({ children }) => {
    //etat local pour stocker le token JWT et le role de l'utilisateur 

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null); 

    // fonction appelée lors de la connexion pour mettre a jour l'état + localStorage

    const login = (newToken, newRole) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
    };

    // fonction appelé pour deconnecter l'utilisateur

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    //Au changement du composant : récupere les données du localStorage
    //(utile en cas de rafraichissement de la page ou navigateur)

    useEffect(() =>{
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role');
        if (savedToken && savedRole) {
            setToken(savedToken);
            setRole(savedRole);
        }
    }, []);

    //on rend accessible le token, le role et les fonctions login/logout a toute l'app
    return (
        <UserContext.Provider value = {{ token, role, login, logout }}>
        {children}
        </UserContext.Provider>
    );
};