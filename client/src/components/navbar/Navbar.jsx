import { Link, Route, Routes } from "react-router-dom";
import './navbar.scss';
export default function Navbar() {
    return(
        <div className="navbar">
            <div className="logo">
                <Link to={'/'}>
                    <img src="/images/logo.png" alt="digiPramman" />
                </Link>
            </div>
            <div className="links"></div>
        </div>
    )
}