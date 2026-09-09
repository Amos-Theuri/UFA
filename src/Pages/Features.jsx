// src/Pages/Features.jsx
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Users2, 
  BarChart3, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";
import featImg from "../assets/featImg.png";
import "../styles/style.css";

export default function Features() {
  const serviceAreas = [
    {
      id: "prof-dev",
      title: "Professional Development",
      icon: GraduationCap,
      description: "Continuous learning through accredited workshops, practical skill-building seminars, and industry-recognized certification tracks.",
      features: [
        "Monthly Hands-on Skills Workshops",
        "UFA Leadership & Career Tracks",
        "Executive Leadership & Governance Training"
      ]
    },
    {
      id: "networking",
      title: "Networking & Events",
      icon: Users2,
      description: "Connect with peers, seasoned industry veterans, and institutional partners through our curated calendar of regional and national events.",
      features: [
        "Annual National UFA Symposium",
        "Quarterly Executive & Mentorship Mixers",
        "County Chapter Gatherings & Summits"
      ]
    },
    {
      id: "research",
      title: "Industry & Youth Research",
      icon: BarChart3,
      description: "Access authoritative data, labor market trends, and evidence-based reports to stay ahead in a rapidly evolving economic landscape.",
      features: [
        "UFA Quarterly Youth Development Journal",
        "Annual Kenyan Youth Employment Reports",
        "Open Data & Research Library Access"
      ]
    },
    {
      id: "advocacy",
      title: "Career & Civic Advocacy",
      icon: Compass,
      description: "Dedicated resources and direct support to advance your career trajectory, discover new job avenues, and champion youth welfare.",
      features: [
        "Exclusive Member Opportunity & Job Board",
        "1-on-1 Personalized Mentorship Matchups",
        "Resume, CV & Portfolio Review Clinics"
      ]
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="text-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Pillars of Impact</span>
            </div>
            <h1>
              Empowering Your <span className="gradient-text">Professional Excellence</span>
            </h1>
            <p>
              Explore our core pillars meticulously designed to support every phase of your personal, professional, and community leadership journey.
            </p>
            <div className="hero-actions">
              <Link to="/Contact" className="btn-primary">
                <span>Get Started With UFA</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img src={featImg} alt="UFA service areas and programs" width="715" height="477" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section">
        <div className="section-head">
          <div className="badge-pill">Service Areas</div>
          <h2 className="section-title">Primary Pillars of Growth</h2>
          <p className="section-subtitle">
            Comprehensive programs and initiatives structured to elevate youth readiness and foster long-term community transformation.
          </p>
        </div>

        <div className="services-grid">
          {serviceAreas.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <div className="service-icon-box">
                    <IconComponent size={26} />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                </div>

                <p className="service-desc">{service.description}</p>

                <ul className="service-checklist">
                  {service.features.map((item, index) => (
                    <li key={index} className="service-item">
                      <CheckCircle2 size={18} className="check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2>Ready to Unlock These Opportunities?</h2>
            <p>
              Join UFA today to participate in our skill tracks, exclusive networking summits, and personalized mentorship programs.
            </p>
            <Link to="/Contact" className="btn-primary">
              <Sparkles size={18} />
              <span>Join UFA Now</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
