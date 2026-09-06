// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/About" },
    { name: "Features", path: "/Features" },
    { name: "Contact", path: "/Contact" },
    { name: "Merchandise", path: "/Merchendise" },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        {/* Brand / Logo */}
        <Link to="/" className={styles.brand}>
          <img src={logoImg} alt="UFA logo" className={styles.logoImage} />
          <span className={styles.brandName}>Unique Focus Association</span>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={styles.hamburger}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span
            className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}
          ></span>
          <span
            className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}
          ></span>
          <span
            className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}
          ></span>
        </button>

        {/* Links & CTA Container */}
        <div
          className={`${styles.menuContainer} ${isOpen ? styles.menuOpen : ""}`}
        >
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path} className={styles.navItem}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${
                    location.pathname === link.path ? styles.activeLink : ""
                  }`}
                  onClick={() => setIsOpen(false)} // Close menu on mobile after selection
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Join CTA Button */}
        <a href="#" className={styles.joinBtn}>
          Join UFA
        </a>
      </nav>
    </header>
  );
}
