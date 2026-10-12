// src/components/JoinModal.jsx
import { useState, useEffect, useRef } from "react";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Send,
  Compass
} from "lucide-react";
import { useJoinModal } from "../context/useJoinModal";
import styles from "./JoinModal.module.css";

const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita Taveta",
  "Tana River",
  "Tharaka Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
  "Diaspora / Outside Kenya"
];

const AREAS_OF_INTEREST = [
  "Youth Leadership & Governance",
  "Mentorship & Career Development",
  "Community Outreach & Volunteering",
  "Technology, AI & Digital Innovation",
  "Entrepreneurship & Business Development",
  "Mental Health & Wellness",
  "Arts, Culture & Creative Media",
  "Sports & Talent Empowerment",
  "Environmental & Climate Action",
  "General Membership / All Activities"
];

const INITIAL_FORM = {
  name: "",
  email: "",
  contact: "",
  county: "",
  areaOfInterest: ""
};

function JoinModalDialog({ onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formAlert, setFormAlert] = useState("");

  const nameInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const validateField = (field, value) => {
    const val = (value || "").trim();
    switch (field) {
      case "name":
        if (!val) return "Full Name is required.";
        if (val.length < 2) return "Please enter at least 2 characters.";
        if (!/[a-zA-Z]/.test(val)) return "Name must include letters.";
        return "";
      case "email":
        if (!val) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return "Please enter a valid email address (e.g. name@domain.com).";
        }
        return "";
      case "contact": {
        if (!val) return "Contact phone number is required.";
        const digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.length < 9) {
          return "Please enter a valid contact number (at least 9 digits).";
        }
        return "";
      }
      case "county":
        if (!val) return "Please select your county.";
        return "";
      case "areaOfInterest":
        if (!val) return "Please select your area of interest.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormAlert("");

    if (errors[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateAll();
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      setErrors(validationErrors);
      setFormAlert("Please complete all required fields correctly before submitting.");
      
      const firstErrorField = errorKeys[0];
      const element = document.getElementById(`join-${firstErrorField}`);
      if (element) {
        element.focus();
      }
      return;
    }

    setErrors({});
    setFormAlert("");
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("ufa_join_applications") || "[]");
        stored.push({
          ...formData,
          submittedAt: new Date().toISOString()
        });
        localStorage.setItem("ufa_join_applications", JSON.stringify(stored));
      } catch (err) {
        console.warn("Could not save application to localStorage:", err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.overlay} 
      onClick={handleBackdropClick} 
      role="presentation"
    >
      <div 
        ref={modalRef} 
        className={styles.modal} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="join-modal-title"
      >
        <button 
          type="button" 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close Join Form"
        >
          <X size={20} />
        </button>

        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>Join Our Movement</span>
          </div>
          <h2 id="join-modal-title" className={styles.title}>
            Join Unique Focus Association
          </h2>
          <p className={styles.subtitle}>
            Connect with an expansive national network of purpose-driven young leaders, mentors, and changemakers across Kenya.
          </p>
        </div>

        <div className={styles.body}>
          {isSuccess ? (
            <div className={styles.successView}>
              <div className={styles.successIconWrapper}>
                <CheckCircle2 size={40} />
              </div>
              <h3 className={styles.successTitle}>Welcome to UFA, {formData.name.split(" ")[0]}!</h3>
              <p className={styles.successText}>
                Your application to join the Unique Focus Association has been received. Our leadership and county coordination team will reach out to you shortly via contact details provided.
              </p>

              <div className={styles.summaryCard}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Applicant:</span>
                  <span className={styles.summaryValue}>{formData.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Email:</span>
                  <span className={styles.summaryValue}>{formData.email}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Contact:</span>
                  <span className={styles.summaryValue}>{formData.contact}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>County:</span>
                  <span className={styles.summaryValue}>{formData.county}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Area of Interest:</span>
                  <span className={styles.summaryValue}>{formData.areaOfInterest}</span>
                </div>
              </div>

              <button 
                type="button" 
                className={styles.doneBtn} 
                onClick={onClose}
              >
                Close & Explore UFA
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {formAlert && (
                <div className={styles.formAlert} role="alert">
                  <AlertCircle size={18} />
                  <span>{formAlert}</span>
                </div>
              )}

              {/* Name Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="join-name" className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    ref={nameInputRef}
                    id="join-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Jane Achieng"
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "join-name-error" : undefined}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.name && (
                  <span id="join-name-error" className={styles.errorMessage}>
                    <AlertCircle size={13} />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="join-email" className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    id="join-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. jane@example.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "join-email-error" : undefined}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.email && (
                  <span id="join-email-error" className={styles.errorMessage}>
                    <AlertCircle size={13} />
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Contact Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="join-contact" className={styles.label}>
                  Phone / Contact <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input
                    id="join-contact"
                    name="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. +254 712 345 678"
                    className={`${styles.input} ${errors.contact ? styles.inputError : ""}`}
                    aria-invalid={!!errors.contact}
                    aria-describedby={errors.contact ? "join-contact-error" : undefined}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.contact && (
                  <span id="join-contact-error" className={styles.errorMessage}>
                    <AlertCircle size={13} />
                    {errors.contact}
                  </span>
                )}
              </div>

              {/* County Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="join-county" className={styles.label}>
                  County <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MapPin size={18} className={styles.inputIcon} />
                  <select
                    id="join-county"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.select} ${errors.county ? styles.inputError : ""}`}
                    aria-invalid={!!errors.county}
                    aria-describedby={errors.county ? "join-county-error" : undefined}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select your county</option>
                    {KENYAN_COUNTIES.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.county && (
                  <span id="join-county-error" className={styles.errorMessage}>
                    <AlertCircle size={13} />
                    {errors.county}
                  </span>
                )}
              </div>

              {/* Area of Interest Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="join-areaOfInterest" className={styles.label}>
                  Area of Interest <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Compass size={18} className={styles.inputIcon} />
                  <select
                    id="join-areaOfInterest"
                    name="areaOfInterest"
                    value={formData.areaOfInterest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.select} ${errors.areaOfInterest ? styles.inputError : ""}`}
                    aria-invalid={!!errors.areaOfInterest}
                    aria-describedby={errors.areaOfInterest ? "join-areaOfInterest-error" : undefined}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select your area of interest</option>
                    {AREAS_OF_INTEREST.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.areaOfInterest && (
                  <span id="join-areaOfInterest-error" className={styles.errorMessage}>
                    <AlertCircle size={13} />
                    {errors.areaOfInterest}
                  </span>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Membership Application</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JoinModal() {
  const { isOpen, closeJoinModal } = useJoinModal();

  if (!isOpen) return null;

  return <JoinModalDialog onClose={closeJoinModal} />;
}

