// src/Pages/Home.jsx
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Compass,
  Video
} from "lucide-react";
import heroImg from "../assets/hero.png";
import logoImg from "../assets/logo.png";
import PropositionBanner from "../components/PropositionBanner";
import ImpactPathwaySection from "../components/ImpactPathwaySection";
import MentorshipProgramsSection from "../components/MentorshipProgramsSection";
import WhoCanParticipateSection from "../components/WhoCanParticipateSection";
import PartnersSection from "../components/PartnersSection";
import { pastEvents } from "../data/pastEvents";
import "../styles/style.css";

export default function Home() {
  const featuredEvents = pastEvents.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="text-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Youth Development & Community Impact</span>
            </div>
            <h1>
              Connecting Kenyan Youth, <br />
              <span className="gradient-text">Empowering Communities</span>
            </h1>
            <p>
              Unique Focus Association (UFA) connects young people to vibrant networks, professional mentorship, practical skills, career opportunities, leadership experiences, and grassroots community initiatives across Kenya.
            </p>
            <div className="hero-actions">
              <Link to="/Contact" className="btn-primary">
                <span>Join Our Network</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/Features" className="btn-secondary">
                <Compass size={18} />
                <span>Mentorship Programmes</span>
              </Link>
            </div>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img
                src={heroImg}
                alt="UFA youth network members collaborating across Kenya"
                width="715"
                height="477"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Distinctive Proposition Banner */}
      <PropositionBanner />

      {/* Vision & Mission Section */}
      <section id="about-vision">
        <div className="vision-container">
          <div className="vision-image-col">
            <div className="vision-logo-frame">
              <img src={logoImg} alt="Unique Focus Association Brand Logo" />
            </div>
          </div>
          <div className="vision-text-col">
            <div className="badge-pill">Who We Are</div>
            <h2>Fostering Personal Growth and Meaningful Community Change</h2>
            <p>
              We empower young people to grow personally and professionally while encouraging them to take an active role in addressing challenges within their communities. Through our programmes, partnerships, and community engagements, we create opportunities for young people to learn, connect, serve, and contribute to lasting transformation.
            </p>
            <div className="vision-highlights">
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Youth Networking Across 47 Counties</span>
              </div>
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>1-on-1 & Group Mentorship Tracks</span>
              </div>
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Mental Health Awareness Talks & Coaching</span>
              </div>
              <div className="vision-point">
                <CheckCircle2 size={18} className="point-icon" />
                <span>Practical Skills & Job Readiness Training</span>
              </div>
            </div>
            <Link to="/About" className="btn-primary">
              <span>Read Our Full Story</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* The Impact Pathway */}
      <ImpactPathwaySection />

      {/* Mentorship Programmes Preview */}
      <MentorshipProgramsSection isPreview={true} />

      {/* Previous Events & Virtual Talks Highlight */}
      <section className="section-wrapper" style={{ backgroundColor: "#ffffff" }}>
        <div className="section-head">
          <div className="badge-pill">Proven Track Record</div>
          <h2 className="section-title">Previous Events & Virtual Talks</h2>
          <p className="section-subtitle">
            UFA has already conducted impactful mental health awareness talks and leadership forums in partnership with regional foundations and corporate leaders.
          </p>
        </div>

        <div className="home-events-grid">
          {featuredEvents.map((event) => (
            <div key={event.id} className="home-event-card">
              <div className="home-event-poster">
                <img src={event.image} alt={event.title} loading="lazy" />
                <span className="home-event-category">{event.category}</span>
              </div>
              <div className="home-event-body">
                <div className="home-event-meta">
                  <span><Calendar size={13} /> {event.date}</span>
                  <span><Video size={13} /> {event.platform}</span>
                </div>
                <h3>{event.title}</h3>
                <p className="home-event-subtitle">{event.subtitle}</p>
                <div className="home-event-speakers">
                  <strong>Speakers:</strong> {event.speakers.map(s => s.name).join(", ")}
                </div>
                <Link to="/Features" className="home-event-link">
                  <span>View Event Details</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link to="/Features" className="btn-secondary" style={{ color: "#0c1e30", borderColor: "rgba(0, 229, 193, 0.4)", backgroundColor: "var(--secondary)" }}>
            <Sparkles size={18} />
            <span>Explore All Events & Past Posters</span>
          </Link>
        </div>
      </section>

      {/* Who Can Participate Section */}
      <WhoCanParticipateSection />

      {/* Strategic Partners Section */}
      <PartnersSection />

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2>Ready to Elevate Your Future & Community?</h2>
            <p>
              Join the Unique Focus Association today. You don&rsquo;t have to be established or influential to belong—all you need is purpose, passion, and the drive to make a difference.
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
