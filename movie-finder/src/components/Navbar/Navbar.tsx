import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar__link">
                Accueil
            </NavLink>
            <NavLink to="/favorites" className="navbar__link">
                Favoris
            </NavLink>
        </nav>
    );
}
