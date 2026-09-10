// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";
import logo from "../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section: Brand, Links & Contact */}
        <div className={styles.topSection}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <Link to="/" className={styles.brand} aria-label="UFA Home">
              <div className={styles.logoWrapper}>
                <img
                  src={logo}
                  alt="Unique Focus Association Logo"
                  className={styles.logoImage}
                />
              </div>
              <div className={styles.brandText}>
                <span className={styles.companyAcronym}>UFA</span>
                <span className={styles.companyName}>
                  Unique Focus Association
                </span>
              </div>
            </Link>
            <p className={styles.brandTagline}>
              Connecting Kenyan youth to networks, mentorship, skills, career
              opportunities, leadership experiences, and community initiatives
              across all 47 counties.
            </p>

            {/* Social Media Links */}
            <div className={styles.socialGroup} aria-label="Social media links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 13.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61593524891091"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on X"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/" className={styles.footerLink}>
                  <span>Home</span>
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </Link>
              </li>
              <li>
                <Link to="/About" className={styles.footerLink}>
                  <span>About Us</span>
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </Link>
              </li>
              <li>
                <Link to="/Features" className={styles.footerLink}>
                  <span>Programs & Events</span>
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </Link>
              </li>
              <li>
                <Link to="/Merchendise" className={styles.footerLink}>
                  <span>Merchandise Store</span>
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </Link>
              </li>
              <li>
                <Link to="/Contact" className={styles.footerLink}>
                  <span>Contact Us</span>
                  <ArrowUpRight size={14} className={styles.arrowIcon} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Focus Pillars Column */}
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Our Focus</h4>
            <ul className={styles.linkList}>
              <li className={styles.focusItem}>
                Youth Networking & Mentorship
              </li>
              <li className={styles.focusItem}>Career & Job Readiness</li>
              <li className={styles.focusItem}>Mental Health Awareness</li>
              <li className={styles.focusItem}>
                Community Empowerment & Support
              </li>
              <li className={styles.focusItem}>
                Environmental & Social Action
              </li>
            </ul>
          </div>

          {/* Contact Summary Column */}
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Get In Touch</h4>
            <div className={styles.contactList}>
              <a
                href="mailto:uniquefocusassociation@gmail.com"
                className={styles.contactItem}
              >
                <Mail size={16} className={styles.contactIcon} />
                <span>uniquefocusassociation@gmail.com</span>
              </a>
              <a href="tel:0113508789" className={styles.contactItem}>
                <Phone size={16} className={styles.contactIcon} />
                <span>+254 113 508 789</span>
              </a>
              <div className={styles.contactItem}>
                <MapPin size={16} className={styles.contactIcon} />
                <span>Kenya • Nationwide Chapters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {currentYear} Unique Focus Association (UFA). All rights
            reserved.
          </p>
          <p className={styles.heartText}>
            Built with <Heart size={14} className={styles.heartIcon} /> for
            Kenya's Youth
          </p>
        </div>
      </div>
    </footer>
  );
}
