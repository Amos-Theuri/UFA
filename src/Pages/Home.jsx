// src/Pages/Home.jsx
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import heroImg from "../assets/hero.png";
import logoImg from "../assets/logo.png";
import partnerImage from "../assets/partner.jpeg";
import "../styles/style.css";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="text-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Empowering Kenya's Next Generation</span>
            </div>
            <h1>
              <span className="gradient-text">Together For A</span>Brighter
              Future
            </h1>
            <p>
              We foster youth networking, mentorship, career development, and
              job readiness while championing health awareness, social
              well-being, and environmental conservation across Kenya.
            </p>
            <div className="hero-actions">
              <Link to="/Contact" className="btn-primary">
                <span>Join UFA Today</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/About" className="btn-secondary">
                <span>Discover Our Story</span>
              </Link>
            </div>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img
                src={heroImg}
                alt="UFA youth network members"
                width="715"
                height="477"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="about-vision">
        <div className="vision-container">
          <div className="vision-image-col">
            <div className="vision-logo-frame">
              <img src={logoImg} alt="Unique Focus Association Brand Logo" />
            </div>
          </div>
          <div className="vision-text-col">
            <div className="badge-pill">Our Vision & Purpose</div>
            <h2>Building a United Movement of Empowered Youth</h2>
            <p>
              Unique Focus Association of Kenya (UFA) is a dynamic organization
              committed to empowering young people and communities through
              leadership development, professional mentorship, practical skills
              training, and sustainable community initiatives.
            </p>
            <div className="vision-highlights">
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Nationwide Youth Networking</span>
              </div>
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Career & Job Readiness Tracks</span>
              </div>
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Health & Environmental Action</span>
              </div>
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Mentorship by Industry Leaders</span>
              </div>
            </div>
            <Link to="/About" className="btn-primary">
              <span>Learn More About Us</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section id="values-section">
        <div className="section-head">
          <div className="badge-pill">Foundational Pillars</div>
          <h2 className="section-title">Our Guiding Principles</h2>
          <p className="section-subtitle">
            The foundation of our association’s commitment to excellence,
            integrity, and impactful transformation.
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon-box">
              <Users size={28} />
            </div>
            <h3>Youth Networking & Mentorship</h3>
            <p>
              Networking and meaningful interaction are at the core of our
              mission. We are building a robust national network of high-value
              members and seasoned mentors to achieve milestone success.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box">
              <TrendingUp size={28} />
            </div>
            <h3>Professional Growth</h3>
            <p>
              Targeted mentorship is a key pillar in our association and serves
              as the driving factor for career advancement, leadership skills,
              and economic empowerment for our members.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box">
              <Lightbulb size={28} />
            </div>
            <h3>Strategic Innovation</h3>
            <p>
              We aim to bring monumental positive change to our communities by
              promoting creative, youth-driven problem solving and sustainable
              entrepreneurial solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners-section">
        <div className="section-head">
          <div className="badge-pill">Collaborative Impact</div>
          <h2 className="section-title">Our Strategic Partners</h2>
          <p className="section-subtitle">
            Working hand-in-hand with leading organizations to expand
            opportunities for Kenyan youth.
          </p>
        </div>

        <div className="partner-card-wrapper">
          <a
            href="https://www.purposelife.co.ke/"
            className="partner-card"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Purpose Life Leadership Hub website"
          >
            <div className="partner-img-box">
              <img src={partnerImage} alt="Purpose Life Leadership Hub Logo" />
            </div>
            <div className="partner-name">
              <span>Purpose Life Leadership Hub</span>
              <ExternalLink size={16} />
            </div>
            <span className="partner-tag">
              Strategic Leadership & Mentorship Partner
            </span>
          </a>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2>Ready to Elevate Your Focus?</h2>
            <p>
              Join the Unique Focus Association today and become part of a
              nationwide community driving leadership excellence, career
              readiness, and positive impact.
            </p>
            <Link to="/Contact" className="btn-primary">
              <Sparkles size={18} />
              <span>Become a Member Today</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
