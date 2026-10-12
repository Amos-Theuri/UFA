// src/Pages/AdminEventsManager.jsx
import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getUpcomingEvents,
  addUpcomingEvent,
  updateUpcomingEvent,
  deleteUpcomingEvent,
  resetToDefaultUpcomingEvents,
  subscribeToUpcomingEvents,
  fetchUpcomingEventsFromSupabase
} from "../services/upcomingEventsService";
import {
  verifyAdminPasscode,
  isAdminAuthenticated,
  adminLogout,
  isLockedOut
} from "../services/adminAuthService";
import styles from "./AdminEventsManager.module.css";

const initialFormState = {
  title: "",
  subtitle: "",
  category: "Leadership Summit",
  date: "",
  time: "",
  location: "",
  platform: "",
  speakers: "",
  registrationLink: "",
  badge: "",
  description: "",
  isPublished: true
};

export default function AdminEventsManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(() => isLockedOut());

  const [events, setEvents] = useState(() => getUpcomingEvents());
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: "", text: "" });

  // Watch lockout timer
  useEffect(() => {
    if (!lockoutSec) return;
    const interval = setInterval(() => {
      const remaining = isLockedOut();
      setLockoutSec(remaining);
      if (!remaining) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSec]);

  // Subscribe to upcoming events reactive updates & fetch from Supabase
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUpcomingEventsFromSupabase().then((latest) => {
      if (latest && latest.length > 0) {
        setEvents(latest);
      }
    });

    const unsubscribe = subscribeToUpcomingEvents((updated) => {
      setEvents(updated);
    });
    return unsubscribe;
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsVerifying(true);

    try {
      const success = await verifyAdminPasscode(passcode);
      if (success) {
        setIsAuthenticated(true);
        setPasscode("");
        setFeedbackMsg({ type: "success", text: "Successfully authenticated as administrator." });
      } else {
        setAuthError("Invalid passcode. Please check credentials and try again.");
      }
    } catch (err) {
      setAuthError(err.message || "Authentication failed.");
      const locked = isLockedOut();
      if (locked) setLockoutSec(locked);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleStartEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title || "",
      subtitle: event.subtitle || "",
      category: event.category || "Leadership Summit",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      platform: event.platform || "",
      speakers: Array.isArray(event.speakers) ? event.speakers.join(", ") : (event.speakers || ""),
      registrationLink: event.registrationLink || "",
      badge: event.badge || "",
      description: event.description || "",
      isPublished: event.isPublished !== false
    });
    setFeedbackMsg({ type: "", text: "" });
    // Scroll smoothly to form
    const formElement = document.getElementById("event-editor-card");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleTogglePublish = (event) => {
    updateUpcomingEvent(event.id, { isPublished: !event.isPublished });
    setFeedbackMsg({
      type: "success",
      text: `Event "${event.title}" is now ${!event.isPublished ? "published" : "in draft"}.`
    });
  };

  const handleDelete = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      deleteUpcomingEvent(event.id);
      if (editingId === event.id) {
        handleCancelEdit();
      }
      setFeedbackMsg({
        type: "success",
        text: `Event "${event.title}" was deleted.`
      });
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Restore factory sample upcoming events? Any custom events will be replaced.")) {
      resetToDefaultUpcomingEvents();
      handleCancelEdit();
      setFeedbackMsg({
        type: "success",
        text: "Sample upcoming events restored successfully."
      });
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedbackMsg({ type: "error", text: "Please enter an event title." });
      return;
    }
    if (!formData.date.trim()) {
      setFeedbackMsg({ type: "error", text: "Please provide a date for the event." });
      return;
    }

    const processedData = {
      ...formData,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category.trim(),
      date: formData.date.trim(),
      time: formData.time.trim(),
      location: formData.location.trim(),
      platform: formData.platform.trim(),
      badge: formData.badge.trim(),
      registrationLink: formData.registrationLink.trim(),
      description: formData.description.trim(),
      speakers: formData.speakers
        ? formData.speakers.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    };

    if (editingId) {
      updateUpcomingEvent(editingId, processedData);
      setFeedbackMsg({
        type: "success",
        text: `Updated "${processedData.title}" successfully!`
      });
      setEditingId(null);
    } else {
      addUpcomingEvent(processedData);
      setFeedbackMsg({
        type: "success",
        text: `Added new event "${processedData.title}" successfully!`
      });
    }

    setFormData(initialFormState);
  };

  // If not authenticated, render Passcode Prompt
  if (!isAuthenticated) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.loginIcon}>
            <Lock size={30} />
          </div>
          <h1 className={styles.loginTitle}>Admin Portal</h1>
          <p className={styles.loginSubtitle}>
            Administrative access required to manage UFA upcoming events & programmes.
          </p>

          {authError && (
            <div className={styles.alertBox}>
              <AlertCircle size={16} style={{ display: "inline", marginRight: "6px" }} />
              {authError}
            </div>
          )}

          {lockoutSec ? (
            <div className={styles.alertBox}>
              Too many incorrect entries. Locked out for {lockoutSec}s.
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="admin-passcode">
                  Administrator Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  className={styles.input}
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }}
                disabled={isVerifying || !passcode}
              >
                <Unlock size={18} />
                {isVerifying ? "Verifying..." : "Access Event Dashboard"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "1.75rem" }}>
            <Link
              to="/Features"
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <ArrowLeft size={14} /> Back to Programs & Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  const publishedCount = events.filter((e) => e.isPublished !== false).length;
  const draftCount = events.length - publishedCount;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "90vh", padding: "2rem 0" }}>
      <div className={styles.dashboardContainer}>
        {/* Top Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.adminHeading}>Upcoming Events Manager</h1>
            <p style={{ margin: "0.35rem 0 0 0", color: "#64748b", fontSize: "0.925rem" }}>
              Manage, publish, and schedule programmes without code changes. Updates reflect instantly across the site.
            </p>
          </div>

          <div className={styles.topBarActions}>
            <Link to="/Features#upcoming-events" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
              <Eye size={16} /> View on Website
            </Link>
            <button onClick={handleResetDefaults} className={`${styles.actionBtn} ${styles.secondaryBtn}`} title="Reset to sample events">
              <RotateCcw size={16} /> Reset Samples
            </button>
            <button onClick={handleLogout} className={`${styles.actionBtn} ${styles.dangerBtn}`}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Global Alert Messages */}
        {feedbackMsg.text && (
          <div className={feedbackMsg.type === "error" ? styles.alertBox : styles.successBox}>
            {feedbackMsg.type === "error" ? (
              <AlertCircle size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
            ) : (
              <CheckCircle2 size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Statistics Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Total Events</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#091e3a", marginTop: "0.25rem" }}>{events.length}</div>
          </div>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 700, textTransform: "uppercase" }}>Live / Published</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a", marginTop: "0.25rem" }}>{publishedCount}</div>
          </div>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Drafts</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#64748b", marginTop: "0.25rem" }}>{draftCount}</div>
          </div>
        </div>

        {/* Existing Events Table */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Current Event Listings</h2>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {events.length} {events.length === 1 ? "event" : "events"} configured
            </span>
          </div>

          {events.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b", padding: "2rem 0" }}>
              No upcoming events found. Use the form below to add your first event.
            </p>
          ) : (
            <table className={styles.eventsTable}>
              <thead>
                <tr>
                  <th>Event Details</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Location / Mode</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <span className={styles.tableTitle}>{event.title}</span>
                      {event.subtitle && <span className={styles.tableSubtitle}>{event.subtitle}</span>}
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0c1e30" }}>
                        {event.category || "General"}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.875rem", color: "#0f172a" }}>{event.date}</div>
                      {event.time && <div style={{ fontSize: "0.775rem", color: "#64748b" }}>{event.time}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: "0.875rem", color: "#0f172a" }}>
                        {event.location || event.platform || "TBA"}
                      </div>
                      {event.platform && event.location && (
                        <div style={{ fontSize: "0.775rem", color: "#64748b" }}>{event.platform}</div>
                      )}
                    </td>
                    <td>
                      {event.isPublished !== false ? (
                        <span className={styles.badgePublished}>Published</span>
                      ) : (
                        <span className={styles.badgeDraft}>Draft</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => handleTogglePublish(event)}
                          title={event.isPublished !== false ? "Unpublish (Make Draft)" : "Publish (Make Visible)"}
                        >
                          {event.isPublished !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => handleStartEdit(event)}
                          title="Edit Event"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          onClick={() => handleDelete(event)}
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Create / Edit Form Card */}
        <div className={styles.contentCard} id="event-editor-card">
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {editingId ? <Edit3 size={20} color="#00e5c1" /> : <Plus size={20} color="#00e5c1" />}
              <h2 className={styles.cardTitle}>
                {editingId ? `Edit Event: "${formData.title || "Untitled"}"` : "Create New Upcoming Event"}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.85rem" }}
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitForm} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-title">
                Event Title *
              </label>
              <input
                id="event-title"
                name="title"
                type="text"
                className={styles.input}
                placeholder="e.g. National Youth Leadership Summit 2026"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-subtitle">
                Subtitle / Theme
              </label>
              <input
                id="event-subtitle"
                name="subtitle"
                type="text"
                className={styles.input}
                placeholder="e.g. Empowering Kenya's Next Generation of Civic Leaders"
                value={formData.subtitle}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-category">
                Category
              </label>
              <select
                id="event-category"
                name="category"
                className={styles.select}
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Leadership Summit">Leadership Summit</option>
                <option value="Webinar">Webinar</option>
                <option value="Workshop">Workshop</option>
                <option value="County Dialogue">County Dialogue</option>
                <option value="Community Forum">Community Forum</option>
                <option value="Mentorship Masterclass">Mentorship Masterclass</option>
                <option value="Special Event">Special Event</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-badge">
                Highlight Badge (Optional)
              </label>
              <input
                id="event-badge"
                name="badge"
                type="text"
                className={styles.input}
                placeholder="e.g. Flagship 2026, Free Entry, Virtual Only"
                value={formData.badge}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-date">
                Date *
              </label>
              <input
                id="event-date"
                name="date"
                type="text"
                className={styles.input}
                placeholder="e.g. April 24, 2026 or Every First Saturday"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-time">
                Time
              </label>
              <input
                id="event-time"
                name="time"
                type="text"
                className={styles.input}
                placeholder="e.g. 09:00 AM - 04:30 PM EAT"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-location">
                Physical Location (if applicable)
              </label>
              <input
                id="event-location"
                name="location"
                type="text"
                className={styles.input}
                placeholder="e.g. KICC, Tsavo Ballroom, Nairobi"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-platform">
                Virtual Platform or Mode
              </label>
              <input
                id="event-platform"
                name="platform"
                type="text"
                className={styles.input}
                placeholder="e.g. Zoom & YouTube Live, Google Meet, In-Person"
                value={formData.platform}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-speakers">
                Key Speakers / Facilitators (Comma separated)
              </label>
              <input
                id="event-speakers"
                name="speakers"
                type="text"
                className={styles.input}
                placeholder="e.g. Hon. Speaker, Marian Magio, Youth Panelists"
                value={formData.speakers}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="event-registration">
                Registration / RSVP Link (URL or form)
              </label>
              <input
                id="event-registration"
                name="registrationLink"
                type="text"
                className={styles.input}
                placeholder="e.g. https://forms.gle/... or mailto:info@ufa.or.ke"
                value={formData.registrationLink}
                onChange={handleInputChange}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="event-description">
                Event Description & Agenda
              </label>
              <textarea
                id="event-description"
                name="description"
                className={styles.textarea}
                placeholder="Describe what attendees can expect, key takeaways, who should attend, and any preparation..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                />
                Publish immediately (make visible to website visitors)
              </label>
            </div>

            <div className={styles.fullWidth} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                type="submit"
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                style={{ padding: "0.85rem 2rem", fontSize: "0.95rem" }}
              >
                {editingId ? "Update Event" : "Create & Add Event"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                  style={{ padding: "0.85rem 1.5rem" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
