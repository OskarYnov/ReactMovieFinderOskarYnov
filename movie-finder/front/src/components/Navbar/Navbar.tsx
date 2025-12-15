import { NavLink } from "react-router-dom";
import { useAuth } from "../../Providers/AuthProvider";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./navbar.css";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar__links">
                <NavLink to="/" className="navbar__link">Accueil</NavLink>
                <NavLink to="/recherche" className="navbar__link">Rechercher</NavLink>
                <NavLink to="/community" className="navbar__link">Communauté</NavLink>
                {isAuthenticated && (
                    <>
                        <NavLink to="/favorites" className="navbar__link">Favoris</NavLink>
                        <NavLink to="/playlists" className="navbar__link">Playlists</NavLink>
                    </>
                )}
            </div>

            <div className="navbar__actions">
                <ThemeToggle />

                {isAuthenticated ? (
                    <div className="navbar__user">
                        <NavLink to={`/user/${user?.id}`} className="navbar__username" title="Voir mon profil">
                            {user?.name}
                        </NavLink>
                        <button onClick={logout} className="navbar__logout">
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    <div className="navbar__auth">
                        <NavLink to="/login" className="navbar__link">Connexion</NavLink>
                        <NavLink to="/register" className="navbar__btn">Inscription</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
}
