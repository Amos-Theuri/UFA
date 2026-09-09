// src/Pages/Features.jsx
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Users2, 
  BarChart3, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Calendar 
} from "lucide-react";
import featImg from "../assets/featImg.png";
import MentorshipProgramsSection from "../components/MentorshipProgramsSection";
import PastEventsSection from "../components/PastEventsSection";
import "../styles/style.css";

export default function Features() {
  const serviceAreas = [
    {
      id: "prof-dev",
      title: "Professional & Skills Development",
      icon: GraduationCap,
      description: "Hands-on workshops, practical skill-building seminars, and job readiness training designed to transition youth seamlessly into the workplace.",
      features: [
        "Monthly Hands-on Skills Workshops & Masterclasses",
        "UFA Leadership & Career Readiness Tracks",
        "Executive Leadership & Governance Coaching"
      ]
    },
    {
      id: "networking",
      title: "Youth Networking & County Chapters",
      icon: Users2,
      description: "Connecting young people with ambitious peers, seasoned industry veterans, and civic institutions across Kenya's 47 counties.",
      features: [
        "County Chapter Gatherings & Regional Summits",
        "Cross-Disciplinary Executive & Mentorship Mixers",
        "Annual National UFA Youth Empowerment Forum"
      ]
    },
    {
      id: "research",
      title: "Mental Health & Well-being Talks",
      icon: BarChart3,
      description: "Creating open, stigma-free platforms for mental health awareness, emotional resilience, psychological counseling, and mindset transformation.",
      features: [
        "Regular Virtual Talks with Certified Psychologists",
        "Safe Peer-to-Peer Support & Wellness Circles",
        "Mindset Reframing & Burnout Prevention Clinics"
      ]
    },
    {
      id: "advocacy",
      title: "Community Action & Civic Engagement",
      icon: Compass,
      description: "Empowering youth to identify pressing community needs, lead volunteer initiatives, and spearhead environmental and social interventions.",
      features: [
        "Grassroots Community Support & Resource Mobilisation",
        "Environmental Conservation & Tree Planting Projects",
        "Civic Leadership, Women's Governance & Advocacy Forums"
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
              <span>Programmes, Mentorship & Impact</span>
            </div>
            <h1>
              Comprehensive Pathways For <br />
              <span className="gradient-text">Youth & Community Growth</span>
            </h1>
            <p>
              Explore our structured mentorship programmes, documented previous talks and events, practical career accelerators, and grassroots community initiatives across Kenya.
            </p>
            <div className="hero-actions">
              <a href="#mentorship-programs" className="btn-primary">
                <Compass size={18} />
                <span>Mentorship Programmes</span>
              </a>
              <a href="#previous-events" className="btn-secondary">
                <Calendar size={18} />
                <span>Previous Events & Talks</span>
              </a>
            </div>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img src={featImg} alt="UFA service areas and programs" width="715" height="477" />
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Programmes Section (Full Showcase) */}
      <MentorshipProgramsSection isPreview={false} />

      {/* Previous Events & Virtual Talks Section (Full Showcase) */}
      <PastEventsSection />

      {/* Core Service Areas Section */}
      <section id="service-areas" className="services-wrapper" style={{ padding: "5.5rem 1.5rem", backgroundColor: "var(--base)" }}>
        <div className="section-head">
          <div className="badge-pill">Foundational Framework</div>
          <h2 className="section-title">Core Service Pillars</h2>
          <p className="section-subtitle">
            Structured initiatives designed to elevate youth readiness and foster long-term community transformation.
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
            <h2>Ready to Join a Mentorship Track or Event?</h2>
            <p>
              Connect with UFA today to enroll in our upcoming cohort, propose a speaking session, or partner on a community project in your county.
            </p>
            <Link to="/Contact" className="btn-primary">
              <Sparkles size={18} />
              <span>Get Started Today</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
