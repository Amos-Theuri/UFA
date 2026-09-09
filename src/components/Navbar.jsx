// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import styles from "./Navbar.module.css";
import logoImg from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/About" },
    { name: "Programs & Events", path: "/Features" },
    { name: "Merchandise", path: "/Merchendise" },
    { name: "Contact", path: "/Contact" },
  ];

  // Scroll state effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        {/* Brand / Logo */}
        <Link 
          to="/" 
          className={styles.brand} 
          aria-label="Unique Focus Association Homepage"
          onClick={() => setIsOpen(false)}
        >
          <div className={styles.logoWrapper}>
            <img src={logoImg} alt="UFA Logo" className={styles.logoImage} />
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandAcronym}>UFA</span>
            <span className={styles.brandName}>Unique Focus Association</span>
          </div>
        </Link>

        {/* Desktop Links Container */}
        <div className={styles.desktopMenu}>
          <ul className={styles.navList}>
            {navLinks.map((link) => {
              const isActive = location.pathname.toLowerCase() === link.path.toLowerCase();
              return (
                <li key={link.path} className={styles.navItem}>
                  <Link
                    to={link.path}
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                  >
                    {link.name}
                    {isActive && <span className={styles.activeIndicator} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Join CTA Button */}
          <Link to="/Contact" className={styles.joinBtn}>
            <span>Join UFA</span>
            <ArrowRight size={16} className={styles.btnIcon} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={styles.hamburger}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={26} color="#00e5c1" /> : <Menu size={26} color="#ffffff" />}
        </button>

        {/* Mobile Menu Drawer */}
        <div
          className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ""}`}
          aria-hidden={!isOpen}
        >
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) => {
              const isActive = location.pathname.toLowerCase() === link.path.toLowerCase();
              return (
                <li key={link.path} className={styles.mobileNavItem}>
                  <Link
                    to={link.path}
                    className={`${styles.mobileNavLink} ${isActive ? styles.mobileActiveLink : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ArrowRight size={18} className={styles.mobileLinkArrow} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.mobileCtaWrapper}>
            <Link
              to="/Contact"
              className={styles.mobileJoinBtn}
              onClick={() => setIsOpen(false)}
            >
              <Sparkles size={18} />
              <span>Join UFA Today</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
