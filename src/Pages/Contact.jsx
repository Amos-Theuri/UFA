// src/Pages/Contact.jsx
import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import featImg from "../assets/featImg.png";
import "../styles/style.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end handler before backend connection
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: ""
      });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="text-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>We'd Love to Hear From You</span>
            </div>
            <h1>
              Connect With <span className="gradient-text">UFA Kenya</span>
            </h1>
            <p>
              Whether you want to join as a member, partner with our youth initiatives, inquire about county chapters, or order merchandise, our team is here to assist.
            </p>
          </div>

          <div className="image-content">
            <div className="image-frame">
              <img src={featImg} alt="UFA communication and engagement" width="715" height="477" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="contact-section">
        <div className="section-head">
          <div className="badge-pill">Get In Touch</div>
          <h2 className="section-title">Contact & Regional Channels</h2>
          <p className="section-subtitle">
            Reach out via phone, email, or send us a direct message below.
          </p>
        </div>

        <div className="contact-layout">
          {/* Left Column: Info Cards */}
          <div className="contact-info-col">
            {/* Phone Card */}
            <div className="contact-info-card">
              <div className="contact-card-icon">
                <Phone size={24} />
              </div>
              <div className="contact-card-content">
                <h3>Official Phone Lines</h3>
                <p>Call or WhatsApp our administrative and youth desks:</p>
                <ul className="phone-list">
                  <li>
                    <a href="tel:0113508789">+254 113 508 789</a> (Primary Desk)
                  </li>
                  <li>
                    <a href="tel:0759984343">+254 759 984 343</a> (Youth Programs)
                  </li>
                  <li>
                    <a href="tel:0795312147">+254 795 312 147</a> (County Chapters)
                  </li>
                </ul>
              </div>
            </div>

            {/* Email Card */}
            <div className="contact-info-card">
              <div className="contact-card-icon">
                <Mail size={24} />
              </div>
              <div className="contact-card-content">
                <h3>Official Email</h3>
                <p>Send inquiries, partnership proposals, and official correspondence:</p>
                <a href="mailto:uniquefocusassociation@gmail.com">
                  uniquefocusassociation@gmail.com
                </a>
              </div>
            </div>

            {/* Office & Operations Card */}
            <div className="contact-info-card">
              <div className="contact-card-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-card-content">
                <h3>National Footprint</h3>
                <p>
                  Coordinating operations across Nairobi, Busia, Kisumu, Nakuru, Siaya, Kiambu, Meru, and expanding to all 47 counties in Kenya.
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="contact-info-card">
              <div className="contact-card-icon">
                <Clock size={24} />
              </div>
              <div className="contact-card-content">
                <h3>Response Hours</h3>
                <p>Monday – Friday: 8:00 AM – 5:00 PM EAT</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                  Weekends & Holidays: Dedicated volunteer support desk
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-card">
            <h3>Send Us a Message</h3>
            <p>
              Fill out the form below and an official representative will get back to you promptly.
            </p>

            {isSubmitted ? (
              <div style={{
                padding: "2rem",
                textAlign: "center",
                background: "var(--secondary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--accent-pop)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <CheckCircle2 size={48} color="#0c1e30" />
                <h4 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.25rem" }}>
                  Message Received!
                </h4>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Thank you for reaching out to Unique Focus Association. We will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Samuel Otieno"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="e.g. 0712 345 678"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Inquiry Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="join">Join UFA / Membership</option>
                      <option value="partner">Partnership & Sponsorship</option>
                      <option value="merchandise">Merchandise & Orders</option>
                      <option value="chapter">County Chapter Information</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message" className="form-label">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell us how we can help or collaborate..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
