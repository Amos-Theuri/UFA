// src/Pages/About.jsx
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight 
} from "lucide-react";
import abtHeroImg from "../assets/abtHero.png";
import aboutImage from "../assets/abt.png";
import Officials from "../components/Officials";
import ImpactPathwaySection from "../components/ImpactPathwaySection";
import WhoCanParticipateSection from "../components/WhoCanParticipateSection";
import PropositionBanner from "../components/PropositionBanner";
import { ufaPillars } from "../data/ufaCore";
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
              <span>Who We Are & What Drives Us</span>
            </div>
            <h1>
              Youth Development Meets <br />
              <span className="gradient-text">Community Impact</span>
            </h1>
            <p>
              Unique Focus Association (UFA) is a youth development and community-impact organisation that connects young people to networks, mentorship, skills, career opportunities, leadership experiences, and community initiatives across Kenya.
            </p>
            <div className="hero-actions">
              <Link to="/Contact" className="btn-primary">
                <span>Join Our Movement</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/Features" className="btn-secondary">
                <span>Our Programmes</span>
              </Link>
            </div>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img src={abtHeroImg} alt="UFA leaders and youth members" width="715" height="477" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story-section">
        <div className="story-grid">
          <div className="story-img-col">
            <div className="story-img-card">
              <img src={aboutImage} alt="Unique Focus Association Journey and Impact" />
            </div>
          </div>
          <div className="story-text-col">
            <div className="badge-pill">Our Journey & Mission</div>
            <h2>Fostering Personal Growth, Unlocking Shared Impact</h2>
            <p>
              Unique Focus Association (UFA) was founded with a bold mission: to connect, mentor, and empower young people across Kenya to take active ownership of their professional futures and community well-being.
            </p>
            <p>
              We believe youth development should not end with personal success. Young people who gain knowledge, skills, networks, and opportunities must also be equipped and empowered to give back and contribute to their communities.
            </p>
            <p>
              Today, UFA is connecting emerging leaders from Siaya, Busia, Kisumu, Homa Bay, Kisii, Nairobi, Murang’a, Kiambu, Meru, Embu, Kakamega, Machakos, and Nakuru counties, while systematically expanding to all 47 counties of Kenya. As we grow, we continuously document our activities, partnerships, beneficiaries, and outcomes to demonstrate measurable impact.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="stats-strip">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1,000+</div>
            <p className="stat-label">Active Youth Members</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">47</div>
            <p className="stat-label">County Target Footprint</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <p className="stat-label">Virtual Talks & Summits</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">5</div>
            <p className="stat-label">Core Mentorship Tracks</p>
          </div>
        </div>
      </section>

      {/* Proposition Banner */}
      <PropositionBanner />

      {/* What We Do: The 9 Core Pillars */}
      <section className="section-wrapper" id="what-we-do" style={{ backgroundColor: "#ffffff" }}>
        <div className="section-head">
          <div className="badge-pill">What We Do</div>
          <h2 className="section-title">The Nine Pillars of UFA</h2>
          <p className="section-subtitle">
            Our comprehensive scope of action designed to guide, empower, and support Kenya&rsquo;s next generation of changemakers.
          </p>
        </div>

        <div className="nine-pillars-grid">
          {ufaPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="pillar-card">
                <div className="pillar-icon-box">
                  <Icon size={24} />
                </div>
                <h3>{pillar.title}</h3>
                <span className="pillar-tagline">{pillar.tagline}</span>
                <p>{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Impact Pathway */}
      <ImpactPathwaySection />

      {/* Who Can Participate */}
      <WhoCanParticipateSection />

      {/* Leadership Team Component */}
      <Officials />

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2>Ready to Be Part of Our Movement?</h2>
            <p>
              Join the Unique Focus Association today and connect with an expansive national network of purpose-driven young leaders, mentors, and community builders.
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
