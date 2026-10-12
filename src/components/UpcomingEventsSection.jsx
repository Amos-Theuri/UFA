// src/components/UpcomingEventsSection.jsx
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Info,
  X,
  Radio
} from "lucide-react";
import { getUpcomingEvents, subscribeToUpcomingEvents } from "../services/upcomingEventsService";
import styles from "./UpcomingEventsSection.module.css";

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState(() => getUpcomingEvents());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToUpcomingEvents((updated) => {
      setEvents(updated);
    });
    return unsubscribe;
  }, []);

  const publishedEvents = events.filter(e => e.isPublished !== false);

  return (
    <section className={styles.section} id="upcoming-events" aria-labelledby="upcoming-events-heading">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Radio size={14} style={{ color: "#ef4444" }} />
            <span>Mark Your Calendar</span>
          </div>
          <h2 id="upcoming-events-heading" className={styles.title}>
            Upcoming Events & Programmes
          </h2>
          <p className={styles.subtitle}>
            Join our next cohort of workshops, national summits, and virtual masterclasses empowering young Kenyans across the country.
          </p>
        </div>

        {/* Content */}
        {publishedEvents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Calendar size={32} />
            </div>
            <h3 className={styles.emptyTitle}>New Events Coming Soon</h3>
            <p className={styles.emptyText}>
              We are finalizing our next schedule of high-impact youth dialogues and county summits. Check back shortly or join our membership to receive direct updates.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {publishedEvents.map((event) => (
              <article key={event.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.categoryTag}>{event.category || "Programme"}</span>
                  {event.badge && (
                    <span className={styles.eventBadge}>
                      <Sparkles size={12} />
                      {event.badge}
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  {event.subtitle && <p className={styles.eventSubtitle}>{event.subtitle}</p>}

                  <div className={styles.metaList}>
                    {event.date && (
                      <div className={styles.metaItem}>
                        <Calendar size={16} className={styles.metaIcon} />
                        <span className={styles.metaText}>{event.date}</span>
                      </div>
                    )}
                    {event.time && (
                      <div className={styles.metaItem}>
                        <Clock size={16} className={styles.metaIcon} />
                        <span className={styles.metaText}>{event.time}</span>
                      </div>
                    )}
                    {(event.location || event.platform) && (
                      <div className={styles.metaItem}>
                        {event.platform && !event.location ? (
                          <Video size={16} className={styles.metaIcon} />
                        ) : (
                          <MapPin size={16} className={styles.metaIcon} />
                        )}
                        <span className={styles.metaText}>
                          {event.location} {event.platform ? `(${event.platform})` : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className={styles.description}>
                      {event.description.length > 160 
                        ? `${event.description.slice(0, 160)}...` 
                        : event.description}
                    </p>
                  )}

                  {event.speakers && (
                    <div className={styles.speakersBox}>
                      <Users size={16} style={{ color: "#114b5f", flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong>Key Speakers: </strong>
                        <span>{event.speakers}</span>
                      </div>
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    {event.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.registerBtn}
                      >
                        <span>Register Now</span>
                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className={styles.registerBtn}
                      >
                        <span>View Details</span>
                        <ArrowRight size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className={styles.learnMoreBtn}
                    >
                      <Info size={16} />
                      <span>More Information</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedEvent && (
          <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className={styles.modalClose} 
                onClick={() => setSelectedEvent(null)}
                aria-label="Close Event Modal"
              >
                <X size={20} />
              </button>

              <div style={{ marginBottom: "1.25rem" }}>
                <span className={styles.categoryTag} style={{ display: "inline-block", marginBottom: "0.5rem" }}>
                  {selectedEvent.category}
                </span>
                <h3 className={styles.title} style={{ fontSize: "1.6rem", textAlign: "left", marginBottom: "0.4rem" }}>
                  {selectedEvent.title}
                </h3>
                {selectedEvent.subtitle && (
                  <p className={styles.eventSubtitle} style={{ marginBottom: "1rem" }}>
                    {selectedEvent.subtitle}
                  </p>
                )}
              </div>

              <div className={styles.metaList} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px" }}>
                <div className={styles.metaItem}>
                  <Calendar size={18} className={styles.metaIcon} />
                  <strong>Date:</strong> {selectedEvent.date}
                </div>
                <div className={styles.metaItem}>
                  <Clock size={18} className={styles.metaIcon} />
                  <strong>Time:</strong> {selectedEvent.time}
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={18} className={styles.metaIcon} />
                  <strong>Format:</strong> {selectedEvent.location || selectedEvent.platform}
                </div>
                {selectedEvent.speakers && (
                  <div className={styles.metaItem}>
                    <Users size={18} className={styles.metaIcon} />
                    <strong>Speakers:</strong> {selectedEvent.speakers}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "1.25rem", marginBottom: "2rem" }}>
                <h4 style={{ color: "var(--text-h)", fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                  About this Event
                </h4>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.65", fontSize: "0.95rem" }}>
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.registrationLink && (
                <a
                  href={selectedEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.registerBtn}
                  style={{ width: "100%", justifyContent: "center", padding: "0.95rem" }}
                >
                  <span>Proceed to Official Registration</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
