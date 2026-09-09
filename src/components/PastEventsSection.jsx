// src/components/PastEventsSection.jsx
import { useState } from "react";
import { pastEvents } from "../data/pastEvents";
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  X
} from "lucide-react";
import styles from "./PastEventsSection.module.css";

export default function PastEventsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const categories = ["All", "Mental Health Awareness", "Leadership & Governance"];

  const filteredEvents = selectedCategory === "All"
    ? pastEvents
    : pastEvents.filter(e => e.category === selectedCategory);

  return (
    <section className={styles.section} id="previous-events" aria-labelledby="events-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Documented Milestones</span>
          </div>
          <h2 id="events-heading" className={styles.title}>
            Previous Events & Virtual Talks
          </h2>
          <p className={styles.subtitle}>
            UFA regularly hosts virtual summits, leadership forums, and mental health awareness talks in collaboration with prominent partners, coaches, and youth leaders across Kenya.
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterRow} role="tablist" aria-label="Event Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className={styles.grid}>
          {filteredEvents.map((event) => (
            <article key={event.id} className={styles.eventCard}>
              <div className={styles.posterWrapper} onClick={() => setActiveModalEvent(event)}>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className={styles.posterImg}
                  loading="lazy"
                />
                <span className={styles.categoryBadge}>{event.category}</span>
                <div className={styles.posterOverlay}>
                  <span className={styles.zoomHint}>
                    <ExternalLink size={16} />
                    <span>View Event Poster</span>
                  </span>
                </div>
              </div>

              <div className={styles.eventBody}>
                <div className={styles.dateTimeRow}>
                  <div className={styles.dateBadge}>
                    <Calendar size={14} className={styles.iconTeal} />
                    <span>{event.date}</span>
                  </div>
                  <div className={styles.timeBadge}>
                    <Clock size={14} className={styles.iconTeal} />
                    <span>{event.time}</span>
                  </div>
                  <div className={styles.platformBadge}>
                    <Video size={14} className={styles.iconTeal} />
                    <span>{event.platform}</span>
                  </div>
                </div>

                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventSubtitle}>{event.subtitle}</p>

                <p className={styles.eventOverview}>{event.overview}</p>

                {/* Partners Involved */}
                <div className={styles.partnersGroup}>
                  <span className={styles.partnerLabel}>In Partnership With:</span>
                  <div className={styles.partnerTags}>
                    {event.partners.map((partner, idx) => (
                      <span key={idx} className={styles.partnerTag}>
                        {partner.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Speakers */}
                <div className={styles.speakersGroup}>
                  <div className={styles.speakersHeader}>
                    <Users size={15} className={styles.iconTeal} />
                    <span>Featured Speakers & Panelists:</span>
                  </div>
                  <ul className={styles.speakersList}>
                    {event.speakers.map((sp, idx) => (
                      <li key={idx} className={styles.speakerItem}>
                        <strong>{sp.name}</strong> – {sp.title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Takeaways */}
                <div className={styles.takeawaysGroup}>
                  <h4 className={styles.takeawaysTitle}>Key Discussions & Insights:</h4>
                  <ul className={styles.takeawaysList}>
                    {event.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                      <li key={idx} className={styles.takeawayItem}>
                        <CheckCircle2 size={15} className={styles.checkIcon} />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hashtags */}
                <div className={styles.hashtagsRow}>
                  {event.hashtags.map((ht, idx) => (
                    <span key={idx} className={styles.hashtag}>
                      {ht}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Lightbox for Poster */}
        {activeModalEvent && (
          <div 
            className={styles.modalBackdrop} 
            onClick={() => setActiveModalEvent(null)}
            role="dialog"
            aria-modal="true"
          >
            <div 
              className={styles.modalContent} 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close poster view"
              >
                <X size={22} />
              </button>
              <div className={styles.modalImgContainer}>
                <img 
                  src={activeModalEvent.image} 
                  alt={activeModalEvent.title} 
                  className={styles.modalPoster}
                />
              </div>
              <div className={styles.modalDetails}>
                <h3>{activeModalEvent.title}</h3>
                <p className={styles.modalSubtitle}>{activeModalEvent.subtitle}</p>
                <p className={styles.modalMeta}>
                  <strong>Date & Time:</strong> {activeModalEvent.date} ({activeModalEvent.time}) &bull; <strong>Platform:</strong> {activeModalEvent.platform}
                </p>
                <div className={styles.modalSpeakerGrid}>
                  {activeModalEvent.speakers.map((sp, idx) => (
                    <div key={idx} className={styles.modalSpeakerCard}>
                      {sp.image && (
                        <img src={sp.image} alt={sp.name} className={styles.speakerAvatar} />
                      )}
                      <div>
                        <strong>{sp.name}</strong>
                        <p>{sp.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
