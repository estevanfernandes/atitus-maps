import "./navbar.css";
import { useAuth } from "../../contexts/AuthContext";
import { Logo } from "../Logo";

export function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="navbar">
            <Logo />
            <div className="navbar-title">Explore novos lugares!</div>
            <button className="close" onClick={logout}>X</button>
        </header>
    );
}