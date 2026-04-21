import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-emoji">🎬</span>
          <span className="logo-text">{profile?.name?.split(' ')[0] || 'SB'}</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/works"
            className={`nav-link ${isActive('/works') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Works
          </Link>
          <Link
            to="/skills"
            className={`nav-link ${isActive('/skills') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Skills
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <a
            href="/admin"
            className="nav-link admin-link"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </a>
        </div>

        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
