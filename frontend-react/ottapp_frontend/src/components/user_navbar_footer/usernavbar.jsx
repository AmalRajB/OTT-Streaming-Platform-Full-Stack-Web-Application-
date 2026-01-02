import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/brandlogo.png';
import './usernavbar.css';

const UserNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="admin-navbar">
            <div className="nav-container">
                <Link to="/home" className="navbar-brand">
                    <img src={Logo} alt="Logo" className="navbar-logo" />
                </Link>

                <button
                    className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger"></span>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/home" className="nav-item">Home</Link>
                    <Link to="/watchlist" className="nav-item">WatchList</Link>
                    <Link to="/watch_history" className="nav-item">WatchHistory</Link>
                    <Link to="/search" className="nav-item">Search</Link>
                    <Link to="/profile" className="nav-item">Profile</Link>

                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;
