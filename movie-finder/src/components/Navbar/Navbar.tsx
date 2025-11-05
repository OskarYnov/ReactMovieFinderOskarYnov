import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar__links">
                <NavLink to="/" className="navbar__link">Accueil</NavLink>
                <NavLink to="/recherche" className="navbar__link">Rechercher</NavLink>
                <NavLink to="/favorites" className="navbar__link">Favoris</NavLink>
            </div>
            <ThemeToggle />
        </nav>
    );
}
