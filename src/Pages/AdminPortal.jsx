// src/Pages/AdminPortal.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  LogOut,
  Calendar,
  ShoppingBag,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  KeyRound
} from "lucide-react";
import {
  adminLogin,
  adminLogout,
  getAdminUser,
  subscribeToAuth,
  activateDevSandbox,
  requestPasswordReset
} from "../services/adminAuthService";
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
  getMerchandise,
  addMerchandiseItem,
  updateMerchandiseItem,
  deleteMerchandiseItem,
  resetToDefaultMerchandise,
  subscribeToMerchandise,
  fetchMerchandiseFromSupabase
} from "../services/merchandiseService";
import {
  getOfficials,
  addOfficial,
  updateOfficial,
  deleteOfficial,
  resetToDefaultOfficials,
  subscribeToOfficials,
  fetchOfficialsFromSupabase
} from "../services/officialsService";
import { uploadImage } from "../services/storageService";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { resolveMerchImage, resolveOfficialImage } from "../lib/assetResolvers";
import styles from "./AdminPortal.module.css";

// Initial Form States
const initialEventForm = {
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
  image: "",
  isPublished: true
};

const initialMerchForm = {
  name: "",
  desc: "",
  badge: "Official Gear",
  image: "",
  isActive: true
};

const initialOfficialForm = {
  name: "",
  title: "",
  bio: "",
  image: "",
  displayOrder: 1,
  isActive: true
};

export default function AdminPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Data states
  const [events, setEvents] = useState(() => getUpcomingEvents());
  const [merchandise, setMerchandise] = useState(() => getMerchandise());
  const [officials, setOfficials] = useState(() => getOfficials());

  // Form states & editing tracking
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [editingEventId, setEditingEventId] = useState(null);

  const [merchForm, setMerchForm] = useState(initialMerchForm);
  const [editingMerchId, setEditingMerchId] = useState(null);

  const [officialForm, setOfficialForm] = useState(initialOfficialForm);
  const [editingOfficialId, setEditingOfficialId] = useState(null);

  // File upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Prevent Search Engines from Indexing the Admin Portal (Security)
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    let addedMeta = false;

    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      robotsMeta.content = "noindex, nofollow";
      document.head.appendChild(robotsMeta);
      addedMeta = true;
    } else {
      robotsMeta.content = "noindex, nofollow";
    }

    const originalTitle = document.title;
    document.title = "UFA Admin Portal | Management Dashboard";

    return () => {
      document.title = originalTitle;
      if (addedMeta && robotsMeta.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      } else if (robotsMeta) {
        robotsMeta.content = "index, follow";
      }
    };
  }, []);

  // 2. Check Auth on mount & subscribe to changes
  useEffect(() => {
    getAdminUser().then((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // 3. Sync events, merchandise, and officials when logged in
  useEffect(() => {
    if (!currentUser) return;

    fetchUpcomingEventsFromSupabase().then((data) => data && setEvents(data));
    fetchMerchandiseFromSupabase().then((data) => data && setMerchandise(data));
    fetchOfficialsFromSupabase().then((data) => data && setOfficials(data));

    const unsubEvents = subscribeToUpcomingEvents((data) => setEvents(data));
    const unsubMerch = subscribeToMerchandise((data) => setMerchandise(data));
    const unsubOfficials = subscribeToOfficials((data) => setOfficials(data));

    return () => {
      unsubEvents();
      unsubMerch();
      unsubOfficials();
    };
  }, [currentUser]);

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setResetMessage("");
    setIsLoggingIn(true);

    try {
      const { user } = await adminLogin(email, password);
      setCurrentUser(user);
      setFeedback({ type: "success", text: "Successfully authenticated with Supabase Auth." });
    } catch (err) {
      setLoginError(err.message || "Failed to log in.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDevSandboxLogin = () => {
    const dev = activateDevSandbox();
    setCurrentUser(dev.user);
    setFeedback({
      type: "warning",
      text: "Running in Development Sandbox Mode. Any changes will be cached locally in browser storage."
    });
  };

  const handleLogout = async () => {
    await adminLogout();
    setCurrentUser(null);
    setEventForm(initialEventForm);
    setMerchForm(initialMerchForm);
    setOfficialForm(initialOfficialForm);
    setEditingEventId(null);
    setEditingMerchId(null);
    setEditingOfficialId(null);
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setLoginError("Please enter your admin email above first.");
      return;
    }
    try {
      await requestPasswordReset(email);
      setResetMessage(`Password reset link sent to ${email}. Check your inbox.`);
    } catch (err) {
      setLoginError(err.message || "Could not send password reset email.");
    }
  };

  // Image upload handler
  const handleFileUpload = async (e, folder, onUploadSuccess) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback({ type: "", text: "" });

    try {
      const result = await uploadImage(file, { folder });
      onUploadSuccess(result.url);
      setFeedback({
        type: "success",
        text: `Image uploaded successfully (${result.isRemote ? "Supabase Cloud Storage" : "Optimized Local Image"})`
      });
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "Image upload failed." });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ===================== EVENT ACTIONS =====================
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date.trim()) {
      setFeedback({ type: "error", text: "Please provide an event title and date." });
      return;
    }

    const payload = {
      ...eventForm,
      title: eventForm.title.trim(),
      subtitle: eventForm.subtitle.trim(),
      category: eventForm.category.trim(),
      date: eventForm.date.trim(),
      time: eventForm.time.trim(),
      location: eventForm.location.trim(),
      platform: eventForm.platform.trim(),
      badge: eventForm.badge.trim(),
      registrationLink: eventForm.registrationLink.trim(),
      description: eventForm.description.trim(),
      image: eventForm.image.trim(),
      speakers: eventForm.speakers
        ? eventForm.speakers.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    };

    if (editingEventId) {
      await updateUpcomingEvent(editingEventId, payload);
      setFeedback({ type: "success", text: `Updated event "${payload.title}" successfully.` });
      setEditingEventId(null);
    } else {
      await addUpcomingEvent(payload);
      setFeedback({ type: "success", text: `Added new event "${payload.title}" successfully.` });
    }

    setEventForm(initialEventForm);
  };

  const handleStartEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
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
      image: event.image || event.image_url || "",
      isPublished: event.isPublished !== false
    });
    setFeedback({ type: "", text: "" });
  };

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Delete event "${event.title}"? This cannot be undone.`)) {
      await deleteUpcomingEvent(event.id);
      if (editingEventId === event.id) {
        setEditingEventId(null);
        setEventForm(initialEventForm);
      }
      setFeedback({ type: "success", text: `Event "${event.title}" was deleted.` });
    }
  };

  // ===================== MERCHANDISE ACTIONS =====================
  const handleSubmitMerch = async (e) => {
    e.preventDefault();
    if (!merchForm.name.trim() || !merchForm.desc.trim()) {
      setFeedback({ type: "error", text: "Please enter product name and description." });
      return;
    }

    const payload = {
      ...merchForm,
      name: merchForm.name.trim(),
      desc: merchForm.desc.trim(),
      badge: merchForm.badge.trim(),
      image: merchForm.image.trim() || "merch_1.png"
    };

    if (editingMerchId) {
      await updateMerchandiseItem(editingMerchId, payload);
      setFeedback({ type: "success", text: `Updated "${payload.name}" successfully.` });
      setEditingMerchId(null);
    } else {
      await addMerchandiseItem(payload);
      setFeedback({ type: "success", text: `Added "${payload.name}" to merchandise store.` });
    }

    setMerchForm(initialMerchForm);
  };

  const handleStartEditMerch = (item) => {
    setEditingMerchId(item.id);
    setMerchForm({
      name: item.name || "",
      desc: item.desc || "",
      badge: item.badge || "Official Gear",
      image: item.image || item.image_url || "",
      isActive: item.isActive !== false
    });
    setFeedback({ type: "", text: "" });
  };

  const handleDeleteMerch = async (item) => {
    if (window.confirm(`Delete "${item.name}" from merchandise?`)) {
      await deleteMerchandiseItem(item.id);
      if (editingMerchId === item.id) {
        setEditingMerchId(null);
        setMerchForm(initialMerchForm);
      }
      setFeedback({ type: "success", text: `Deleted "${item.name}" successfully.` });
    }
  };

  // ===================== OFFICIALS ACTIONS =====================
  const handleSubmitOfficial = async (e) => {
    e.preventDefault();
    if (!officialForm.name.trim() || !officialForm.title.trim()) {
      setFeedback({ type: "error", text: "Please provide official's name and title." });
      return;
    }

    const payload = {
      ...officialForm,
      name: officialForm.name.trim(),
      title: officialForm.title.trim(),
      bio: officialForm.bio.trim(),
      image: officialForm.image.trim() || "/officials/official_1.jpeg",
      displayOrder: Number(officialForm.displayOrder) || 1
    };

    if (editingOfficialId) {
      await updateOfficial(editingOfficialId, payload);
      setFeedback({ type: "success", text: `Updated leadership entry for "${payload.name}".` });
      setEditingOfficialId(null);
    } else {
      await addOfficial(payload);
      setFeedback({ type: "success", text: `Added "${payload.name}" to leadership team.` });
    }

    setOfficialForm(initialOfficialForm);
  };

  const handleStartEditOfficial = (official) => {
    setEditingOfficialId(official.id);
    setOfficialForm({
      name: official.name || "",
      title: official.title || "",
      bio: official.bio || "",
      image: official.image || official.image_url || "",
      displayOrder: official.displayOrder || official.display_order || 1,
      isActive: official.isActive !== false
    });
    setFeedback({ type: "", text: "" });
  };

  const handleDeleteOfficial = async (official) => {
    if (window.confirm(`Remove official "${official.name}" from leadership list?`)) {
      await deleteOfficial(official.id);
      if (editingOfficialId === official.id) {
        setEditingOfficialId(null);
        setOfficialForm(initialOfficialForm);
      }
      setFeedback({ type: "success", text: `Official "${official.name}" was removed.` });
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <ShieldCheck size={36} color="#00e5c1" style={{ animation: "pulse 1.5s infinite" }} />
          <p style={{ marginTop: "1rem", fontWeight: 600 }}>Securing session...</p>
        </div>
      </div>
    );
  }

  // ===================== UNAUTHENTICATED LOGIN SCREEN =====================
  if (!currentUser) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.loginIcon}>
            <Lock size={32} />
          </div>
          <h1 className={styles.loginTitle}>Admin Portal Login</h1>
          <p className={styles.loginSubtitle}>
            Administrative access is protected by Supabase Server-side Authentication & Row Level Security.
          </p>

          {loginError && (
            <div className={styles.alertBox}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          {resetMessage && (
            <div className={styles.successBox}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{resetMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="admin-email">
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                className={styles.input}
                placeholder="admin@uniquefocusassociation.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={styles.input}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginTop: "0.5rem" }}
              disabled={isLoggingIn}
            >
              <KeyRound size={18} />
              {isLoggingIn ? "Verifying Credentials..." : "Sign In to Admin Portal"}
            </button>
          </form>

          <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={handlePasswordReset}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.825rem",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Forgot password?
            </button>
            <Link
              to="/"
              style={{
                fontSize: "0.825rem",
                color: "#64748b",
                textDecoration: "none"
              }}
            >
              Back to Home
            </Link>
          </div>

          {!isSupabaseConfigured && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "#fffbeb",
                border: "1px dashed #f59e0b",
                borderRadius: "12px",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#b45309", fontWeight: 700, fontSize: "0.85rem" }}>
                <AlertCircle size={16} />
                <span>Supabase Not Yet Configured in .env</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#78350f", margin: "0.4rem 0 0.75rem 0", lineHeight: 1.4 }}>
                To enable live cloud database sync, set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>. You can test portal features locally using the development sandbox:
              </p>
              <button
                type="button"
                onClick={handleDevSandboxLogin}
                className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem", padding: "0.5rem" }}
              >
                Enter Development Sandbox (Local Storage)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== AUTHENTICATED DASHBOARD =====================
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "90vh", padding: "2rem 0" }}>
      <div className={styles.dashboardContainer}>
        {/* Top Header Bar */}
        <div className={styles.topBar}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h1 className={styles.adminHeading}>UFA Admin Portal</h1>
              {currentUser.isSandbox && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.6rem",
                    background: "#fef3c7",
                    color: "#92400e",
                    fontWeight: 700,
                    borderRadius: "9999px",
                    border: "1px solid #fde68a"
                  }}
                >
                  Dev Sandbox
                </span>
              )}
            </div>
            <p style={{ margin: "0.35rem 0 0 0", color: "#64748b", fontSize: "0.925rem" }}>
              Signed in as <strong>{currentUser.email || "Administrator"}</strong>. Manage association content, events, merchandise, and officials.
            </p>
          </div>

          <div className={styles.topBarActions}>
            <Link to="/Features#upcoming-events" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
              <Eye size={16} /> View Events
            </Link>
            <Link to="/Merchendise" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
              <ShoppingBag size={16} /> View Store
            </Link>
            <button onClick={handleLogout} className={`${styles.actionBtn} ${styles.dangerBtn}`}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback.text && (
          <div className={feedback.type === "error" ? styles.alertBox : feedback.type === "warning" ? styles.warningBox : styles.successBox}>
            {feedback.type === "error" ? (
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
            ) : feedback.type === "warning" ? (
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className={styles.tabsContainer}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "events" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <Calendar size={18} />
            <span>Upcoming Events</span>
            <span className={styles.tabBadge}>{events.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "merchandise" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("merchandise")}
          >
            <ShoppingBag size={18} />
            <span>Merchandise</span>
            <span className={styles.tabBadge}>{merchandise.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "officials" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("officials")}
          >
            <Users size={18} />
            <span>Officials & Leadership</span>
            <span className={styles.tabBadge}>{officials.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "security" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <ShieldCheck size={18} />
            <span>Security & Endpoints</span>
          </button>
        </div>

        {/* ===================== TAB 1: UPCOMING EVENTS ===================== */}
        {activeTab === "events" && (
          <>
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Current Upcoming Events ({events.length})</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Restore sample upcoming events? Custom entries will be reset.")) {
                      resetToDefaultUpcomingEvents();
                      setFeedback({ type: "success", text: "Restored default sample events." });
                    }
                  }}
                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                >
                  <RotateCcw size={14} /> Reset Samples
                </button>
              </div>

              {events.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "2rem 0" }}>
                  No upcoming events configured. Use the form below to add one.
                </p>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Mode / Venue</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td style={{ width: "60px" }}>
                          {ev.image ? (
                            <img src={ev.image} alt={ev.title} className={styles.tableThumb} />
                          ) : (
                            <div className={styles.tableThumb} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ImageIcon size={18} color="#94a3b8" />
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={styles.tableTitle}>{ev.title}</span>
                          {ev.subtitle && <span className={styles.tableSubtitle}>{ev.subtitle}</span>}
                        </td>
                        <td>{ev.category || "General"}</td>
                        <td>
                          <div>{ev.date}</div>
                          {ev.time && <div style={{ fontSize: "0.775rem", color: "#64748b" }}>{ev.time}</div>}
                        </td>
                        <td>{ev.location || ev.platform || "TBA"}</td>
                        <td>
                          {ev.isPublished !== false ? (
                            <span className={styles.badgePublished}>Published</span>
                          ) : (
                            <span className={styles.badgeDraft}>Draft</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              title={ev.isPublished !== false ? "Make Draft" : "Make Visible"}
                              onClick={() => {
                                updateUpcomingEvent(ev.id, { isPublished: !ev.isPublished });
                                setFeedback({ type: "success", text: `Updated visibility for "${ev.title}".` });
                              }}
                            >
                              {ev.isPublished !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              title="Edit Event"
                              onClick={() => handleStartEditEvent(ev)}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                              title="Delete Event"
                              onClick={() => handleDeleteEvent(ev)}
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

            {/* Event Form */}
            <div className={styles.contentCard} id="event-editor-card">
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {editingEventId ? <Edit3 size={20} color="#00e5c1" /> : <Plus size={20} color="#00e5c1" />}
                  <h2 className={styles.cardTitle}>
                    {editingEventId ? `Edit Event: "${eventForm.title || "Untitled"}"` : "Add New Upcoming Event"}
                  </h2>
                </div>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm(initialEventForm);
                    }}
                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitEvent} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-title">Event Title *</label>
                  <input
                    id="ev-title"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. National Youth Leadership Summit 2026"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-subtitle">Theme / Subtitle</label>
                  <input
                    id="ev-subtitle"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Empowering Kenya's Next Generation"
                    value={eventForm.subtitle}
                    onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-category">Category</label>
                  <select
                    id="ev-category"
                    className={styles.select}
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
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
                  <label className={styles.label} htmlFor="ev-badge">Highlight Badge</label>
                  <input
                    id="ev-badge"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Flagship 2026, Free Entry, Virtual Only"
                    value={eventForm.badge}
                    onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-date">Date *</label>
                  <input
                    id="ev-date"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Saturday, 28th November 2026"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-time">Time</label>
                  <input
                    id="ev-time"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. 09:00 AM – 04:30 PM EAT"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-location">Physical Venue</label>
                  <input
                    id="ev-location"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. KICC, Tsavo Ballroom, Nairobi"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-platform">Virtual Mode / Platform</label>
                  <input
                    id="ev-platform"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Hybrid (In-person & Zoom)"
                    value={eventForm.platform}
                    onChange={(e) => setEventForm({ ...eventForm, platform: e.target.value })}
                  />
                </div>

                {/* Event Image Upload Section */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Event Banner / Promotional Image</label>
                  <div
                    className={styles.uploadZone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={24} color="#00e5c1" />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                      {uploadingImage ? "Processing image upload..." : "Click to upload an image from device"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      Supports PNG, JPG, WebP up to 5MB (Synced to Supabase Storage or local cache)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFileUpload(e, "events", (url) =>
                          setEventForm((prev) => ({ ...prev, image: url }))
                        )
                      }
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Or enter image URL:</span>
                    <input
                      type="text"
                      className={styles.input}
                      style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                      placeholder="https://example.com/banner.jpg"
                      value={eventForm.image}
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                    />
                  </div>

                  {eventForm.image && (
                    <div className={styles.imagePreviewBox}>
                      <img src={eventForm.image} alt="Event Preview" className={styles.previewImg} />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => setEventForm({ ...eventForm, image: "" })}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-speakers">Speakers (Comma separated)</label>
                  <input
                    id="ev-speakers"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Joshua Omondi, Marian Magio, Dennis Okumu"
                    value={eventForm.speakers}
                    onChange={(e) => setEventForm({ ...eventForm, speakers: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="ev-reg">Registration / RSVP Link</label>
                  <input
                    id="ev-reg"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. https://forms.gle/..."
                    value={eventForm.registrationLink}
                    onChange={(e) => setEventForm({ ...eventForm, registrationLink: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label} htmlFor="ev-desc">Event Description</label>
                  <textarea
                    id="ev-desc"
                    className={styles.textarea}
                    placeholder="Details about program, speakers, target youth audience, certificates, takeaways..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={eventForm.isPublished}
                      onChange={(e) => setEventForm({ ...eventForm, isPublished: e.target.checked })}
                    />
                    Publish immediately (make visible to website visitors)
                  </label>
                </div>

                <div className={styles.fullWidth} style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button type="submit" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    {editingEventId ? "Save Event Changes" : "Create & Add Event"}
                  </button>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEventId(null);
                        setEventForm(initialEventForm);
                      }}
                      className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* ===================== TAB 2: MERCHANDISE ===================== */}
        {activeTab === "merchandise" && (
          <>
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Merchandise Catalogue ({merchandise.length})</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Reset merchandise to default association catalogue?")) {
                      resetToDefaultMerchandise();
                      setFeedback({ type: "success", text: "Merchandise reset to default catalogue." });
                    }
                  }}
                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                >
                  <RotateCcw size={14} /> Reset Catalogue
                </button>
              </div>

              {merchandise.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "2rem 0" }}>
                  No merchandise items found. Add products below.
                </p>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Badge</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchandise.map((item) => {
                      const thumbSrc = resolveMerchImage(item);
                      return (
                        <tr key={item.id}>
                          <td style={{ width: "60px" }}>
                            <img src={thumbSrc} alt={item.name} className={styles.tableThumb} />
                          </td>
                          <td>
                            <span className={styles.tableTitle}>{item.name}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "0.8rem", background: "#e0f2fe", color: "#0369a1", padding: "0.2rem 0.55rem", borderRadius: "9999px", fontWeight: 700 }}>
                              {item.badge || "Gear"}
                            </span>
                          </td>
                          <td style={{ maxWidth: "320px", color: "#475569", fontSize: "0.85rem" }}>
                            {item.desc}
                          </td>
                          <td>
                            {item.isActive !== false ? (
                              <span className={styles.badgePublished}>Active</span>
                            ) : (
                              <span className={styles.badgeDraft}>Hidden</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title={item.isActive !== false ? "Hide from Store" : "Show in Store"}
                                onClick={() => {
                                  updateMerchandiseItem(item.id, { isActive: !item.isActive });
                                  setFeedback({ type: "success", text: `Toggled status for "${item.name}".` });
                                }}
                              >
                                {item.isActive !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title="Edit Product"
                                onClick={() => handleStartEditMerch(item)}
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                title="Delete Product"
                                onClick={() => handleDeleteMerch(item)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Merchandise Form */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {editingMerchId ? <Edit3 size={20} color="#00e5c1" /> : <Plus size={20} color="#00e5c1" />}
                  <h2 className={styles.cardTitle}>
                    {editingMerchId ? `Edit Product: "${merchForm.name}"` : "Add New Merchandise Item"}
                  </h2>
                </div>
                {editingMerchId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMerchId(null);
                      setMerchForm(initialMerchForm);
                    }}
                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitMerch} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="m-name">Product Name *</label>
                  <input
                    id="m-name"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. UFA Commemorative Scarf"
                    value={merchForm.name}
                    onChange={(e) => setMerchForm({ ...merchForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="m-badge">Badge Tag</label>
                  <input
                    id="m-badge"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Official Gear, Best Seller, Essential, Popular"
                    value={merchForm.badge}
                    onChange={(e) => setMerchForm({ ...merchForm, badge: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label} htmlFor="m-desc">Description *</label>
                  <textarea
                    id="m-desc"
                    className={styles.textarea}
                    placeholder="Description of fabric, usage, fit, branding, and empowerment message..."
                    value={merchForm.desc}
                    onChange={(e) => setMerchForm({ ...merchForm, desc: e.target.value })}
                    required
                  />
                </div>

                {/* Merchandise Image Upload */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Product Image</label>
                  <div
                    className={styles.uploadZone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={24} color="#00e5c1" />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                      Upload product photo
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      PNG, JPG or WebP (Supports transparent product backgrounds)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFileUpload(e, "merchandise", (url) =>
                          setMerchForm((prev) => ({ ...prev, image: url }))
                        )
                      }
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Or select bundled asset:</span>
                    <select
                      className={styles.select}
                      style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                      value={merchForm.image}
                      onChange={(e) => setMerchForm({ ...merchForm, image: e.target.value })}
                    >
                      <option value="">-- Choose Preset or Upload Above --</option>
                      <option value="merch_1.png">Arm Band (merch_1.png)</option>
                      <option value="merch_2.png">Notebook (merch_2.png)</option>
                      <option value="merch_3.png">Scarf (merch_3.png)</option>
                      <option value="merch_4.png">Hoodie (merch_4.png)</option>
                      <option value="merch_5.png">Umbrella (merch_5.png)</option>
                      <option value="merch_6.png">Cap (merch_6.png)</option>
                      <option value="merch_7.png">T-Shirt (merch_7.png)</option>
                      <option value="merch_8.png">Polo (merch_8.png)</option>
                      <option value="merch_9.png">Shirt (merch_9.png)</option>
                    </select>
                  </div>

                  {merchForm.image && (
                    <div className={styles.imagePreviewBox}>
                      <img src={resolveMerchImage(merchForm.image)} alt="Preview" className={styles.previewImg} />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => setMerchForm({ ...merchForm, image: "" })}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={merchForm.isActive}
                      onChange={(e) => setMerchForm({ ...merchForm, isActive: e.target.checked })}
                    />
                    Active (visible to visitors in Merchandise store)
                  </label>
                </div>

                <div className={styles.fullWidth} style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button type="submit" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    {editingMerchId ? "Save Product Changes" : "Add Product to Catalogue"}
                  </button>
                  {editingMerchId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMerchId(null);
                        setMerchForm(initialMerchForm);
                      }}
                      className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* ===================== TAB 3: OFFICIALS & LEADERSHIP ===================== */}
        {activeTab === "officials" && (
          <>
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Association Leadership ({officials.length})</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Reset leadership to original 11 national officials?")) {
                      resetToDefaultOfficials();
                      setFeedback({ type: "success", text: "Reset leadership team to default." });
                    }
                  }}
                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                >
                  <RotateCcw size={14} /> Reset Leadership
                </button>
              </div>

              {officials.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "2rem 0" }}>
                  No officials registered. Add officials below.
                </p>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Leadership Title / Office</th>
                      <th>Bio Summary</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officials.map((off) => {
                      const avatarSrc = resolveOfficialImage(off);
                      return (
                        <tr key={off.id}>
                          <td style={{ width: "60px" }}>
                            <img
                              src={avatarSrc}
                              alt={off.name}
                              className={styles.tableThumb}
                              style={{ borderRadius: "50%" }}
                            />
                          </td>
                          <td>
                            <span className={styles.tableTitle}>{off.name}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: "#0c1e30", fontSize: "0.85rem" }}>
                              {off.title}
                            </span>
                          </td>
                          <td style={{ maxWidth: "340px", color: "#475569", fontSize: "0.85rem" }}>
                            {off.bio}
                          </td>
                          <td>
                            {off.isActive !== false ? (
                              <span className={styles.badgePublished}>Active</span>
                            ) : (
                              <span className={styles.badgeDraft}>Hidden</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title={off.isActive !== false ? "Hide Official" : "Show Official"}
                                onClick={() => {
                                  updateOfficial(off.id, { isActive: !off.isActive });
                                  setFeedback({ type: "success", text: `Toggled status for "${off.name}".` });
                                }}
                              >
                                {off.isActive !== false ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title="Edit Official"
                                onClick={() => handleStartEditOfficial(off)}
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                title="Delete Official"
                                onClick={() => handleDeleteOfficial(off)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Official Form */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {editingOfficialId ? <Edit3 size={20} color="#00e5c1" /> : <Plus size={20} color="#00e5c1" />}
                  <h2 className={styles.cardTitle}>
                    {editingOfficialId ? `Edit Official: "${officialForm.name}"` : "Add New Official / Leader"}
                  </h2>
                </div>
                {editingOfficialId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOfficialId(null);
                      setOfficialForm(initialOfficialForm);
                    }}
                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitOfficial} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="o-name">Official Name *</label>
                  <input
                    id="o-name"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Joshua Omondi"
                    value={officialForm.name}
                    onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="o-title">Title / Role *</label>
                  <input
                    id="o-title"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Chief Executive Officer / National Chairperson"
                    value={officialForm.title}
                    onChange={(e) => setOfficialForm({ ...officialForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label} htmlFor="o-bio">Biography / Mandate Summary</label>
                  <textarea
                    id="o-bio"
                    className={styles.textarea}
                    placeholder="Leading strategic vision and organizational growth across national operations..."
                    value={officialForm.bio}
                    onChange={(e) => setOfficialForm({ ...officialForm, bio: e.target.value })}
                  />
                </div>

                {/* Photo Upload Section */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Official Leadership Portrait Photo</label>
                  <div
                    className={styles.uploadZone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={24} color="#00e5c1" />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                      Upload portrait photo from device
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      Square or portrait aspect ratio recommended (PNG, JPG, WebP)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFileUpload(e, "officials", (url) =>
                          setOfficialForm((prev) => ({ ...prev, image: url }))
                        )
                      }
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Or select bundled portrait:</span>
                    <select
                      className={styles.select}
                      style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                      value={officialForm.image}
                      onChange={(e) => setOfficialForm({ ...officialForm, image: e.target.value })}
                    >
                      <option value="">-- Choose Existing Asset or Upload Above --</option>
                      <option value="/officials/official_1.jpeg">official_1.jpeg</option>
                      <option value="/officials/official_2.jpeg">official_2.jpeg</option>
                      <option value="/officials/official_3.jpeg">official_3.jpeg</option>
                      <option value="/officials/official_4.jpeg">official_4.jpeg</option>
                      <option value="/officials/official_5.jpeg">official_5.jpeg</option>
                      <option value="/officials/official_6.jpeg">official_6.jpeg</option>
                      <option value="/officials/official_7.jpg">official_7.jpg</option>
                      <option value="/officials/official_8.jpeg">official_8.jpeg</option>
                      <option value="/officials/official_9.jpeg">official_9.jpeg</option>
                      <option value="/officials/official_10.jpg">official_10.jpg</option>
                      <option value="/officials/official_11.jpeg">official_11.jpeg</option>
                    </select>
                  </div>

                  {officialForm.image && (
                    <div className={styles.imagePreviewBox}>
                      <img
                        src={resolveOfficialImage(officialForm.image)}
                        alt="Portrait Preview"
                        className={styles.previewImg}
                        style={{ width: "90px", height: "90px", borderRadius: "50%" }}
                      />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => setOfficialForm({ ...officialForm, image: "" })}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="o-order">Display Sequence Order</label>
                  <input
                    id="o-order"
                    type="number"
                    min="1"
                    className={styles.input}
                    value={officialForm.displayOrder}
                    onChange={(e) => setOfficialForm({ ...officialForm, displayOrder: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={officialForm.isActive}
                      onChange={(e) => setOfficialForm({ ...officialForm, isActive: e.target.checked })}
                    />
                    Active (visible on Leadership section of website)
                  </label>
                </div>

                <div className={styles.fullWidth} style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button type="submit" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    {editingOfficialId ? "Save Official Changes" : "Add Leader to Team"}
                  </button>
                  {editingOfficialId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOfficialId(null);
                        setOfficialForm(initialOfficialForm);
                      }}
                      className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* ===================== TAB 4: SECURITY & ENDPOINTS ===================== */}
        {activeTab === "security" && (
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <ShieldCheck size={22} color="#00e5c1" />
                <h2 className={styles.cardTitle}>Security Implementation & Architecture</h2>
              </div>
            </div>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.05rem", color: "#091e3a", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  1. Server-Side Supabase Auth (Client-Side Auth Removed)
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                  The vulnerable client-side SHA256 passcode check previously embedded in browser JavaScript has been completely removed.
                  Authentication is now verified strictly by the Supabase GoTrue Auth service using signed cryptographic JWT tokens.
                  Sessions are refreshed automatically and cannot be forged in client storage.
                </p>
              </div>

              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.05rem", color: "#091e3a", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  2. Row Level Security (RLS) on All Endpoints
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                  Every PostgreSQL table (<code>upcoming_events</code>, <code>merchandise</code>, <code>officials</code>, <code>membership_applications</code>, <code>contact_messages</code>)
                  enforces Row Level Security (RLS) targeting explicit roles (<code>TO anon</code> and <code>TO authenticated</code>).
                  Anonymous visitors can only read published events, active merchandise, and active officials. Only authenticated administrators can create, update, or delete records.
                </p>
              </div>

              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.05rem", color: "#091e3a", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  3. Visitor Isolation & Crawler Protection
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                  The admin portal is completely unlinked from navigation menus, footers, and visitor pages.
                  In addition, <code>robots.txt</code> explicitly disallows <code>/admin</code> and <code>/portal/</code>,
                  and a dynamic <code>&lt;meta name="robots" content="noindex, nofollow"&gt;</code> tag is attached whenever this view is loaded.
                </p>
              </div>

              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.05rem", color: "#091e3a", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  4. Secure Supabase Storage Bucket (<code>ufa-media</code>)
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                  The storage bucket restricts <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> operations exclusively to authenticated administrators, while allowing public <code>SELECT</code> for image asset rendering. Uploads are strictly limited to images under 5MB.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
