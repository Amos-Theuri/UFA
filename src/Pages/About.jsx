// src/Pages/About.jsx
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Lightbulb, 
  Users2 
} from "lucide-react";
import abtHeroImg from "../assets/abtHero.png";
import aboutImage from "../assets/abt.png";
import Officials from "../components/Officials";
import "../styles/style.css";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="text-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Our Vision & Legacy</span>
            </div>
            <h1>
              Empowering Youth to <span className="gradient-text">Shape Kenya's Future</span>
            </h1>
            <p>
              The Unique Focus Association connects visionary youth, fostering innovation, leadership, and professional excellence across industries and grassroots communities.
            </p>
            <div className="hero-actions">
              <Link to="/Contact" className="btn-primary">
                <span>Join Our Network</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img src={abtHeroImg} alt="UFA association leaders and members" width="715" height="477" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story-section">
        <div className="story-grid">
          <div className="story-img-col">
            <div className="story-img-card">
              <img src={aboutImage} alt="Unique Focus Association Journey" />
            </div>
          </div>
          <div className="story-text-col">
            <div className="badge-pill">Our Journey</div>
            <h2>A Legacy of Purpose & Youth Leadership</h2>
            <p>
              Unique Focus Association of Kenya (UFA) was founded in 2025 with a bold mission to connect, empower, and unite young people across Kenya. What began as an ambitious youth-focused initiative has rapidly grown into a vibrant nationwide movement bringing together emerging leaders from diverse counties, disciplines, and backgrounds.
            </p>
            <p>
              Since our establishment, UFA has connected youth from Busia, Siaya, Kisumu, Homa Bay, Kisii, Nairobi, Murang’a, Kiambu, Meru, Embu, Kakamega, and Nakuru counties, among many others. Through hands-on mentorship, skills training, and civic engagement, we provide a solid launchpad for youth potential.
            </p>
            <p>
              Our journey has only just begun. We are actively expanding to all 47 counties of Kenya, creating a united national network of purpose-driven young changemakers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="stats-strip">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1,000+</div>
            <p className="stat-label">Active Members</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">1+</div>
            <p className="stat-label">Years of Excellence</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <p className="stat-label">Annual Events & Summits</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">12+</div>
            <p className="stat-label">County Chapters</p>
          </div>
        </div>
      </section>

      {/* Leadership Team Component */}
      <Officials />

      {/* Core Principles Section */}
      <section id="values-section">
        <div className="section-head">
          <div className="badge-pill">What Drives Us</div>
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            The ethical pillars that guide every decision, program, and partnership within UFA.
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon-box">
              <Shield size={28} />
            </div>
            <h3>Integrity</h3>
            <p>
              We uphold the highest ethical standards in all our endeavors, ensuring transparency, accountability, and trust form the bedrock of our association.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box">
              <Lightbulb size={28} />
            </div>
            <h3>Innovation</h3>
            <p>
              We embrace forward-thinking solutions and creative thinking, constantly seeking new ways to add value and drive progress for our members.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box">
              <Users2 size={28} />
            </div>
            <h3>Community</h3>
            <p>
              We believe in the transformative power of collective wisdom. Fostering a supportive, inclusive, and collaborative environment is essential to mutual success.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2>Ready to Be Part of Our Movement?</h2>
            <p>
              Join the Unique Focus Association today and connect with an expansive national network of young leaders and mentors.
            </p>
            <Link to="/Contact" className="btn-primary">
              <Sparkles size={18} />
              <span>Join UFA Today</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
