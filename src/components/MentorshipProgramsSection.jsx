// src/components/MentorshipProgramsSection.jsx
import { Link } from "react-router-dom";
import { mentorshipPrograms } from "../data/mentorshipPrograms";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Users, 
  Target, 
  ArrowRight,
  Compass
} from "lucide-react";
import styles from "./MentorshipProgramsSection.module.css";

export default function MentorshipProgramsSection({ isPreview = false }) {
  const displayedPrograms = isPreview ? mentorshipPrograms.slice(0, 3) : mentorshipPrograms;

  return (
    <section className={styles.section} id="mentorship-programs" aria-labelledby="mentorship-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Compass size={16} />
            <span>Structured Mentorship Tracks</span>
          </div>
          <h2 id="mentorship-heading" className={styles.title}>
            Mentorship Programmes Offered
          </h2>
          <p className={styles.subtitle}>
            Guided by seasoned industry professionals, community leaders, and experienced executives. UFA mentorship bridges academic theory with workplace reality and civic leadership.
          </p>
        </div>

        <div className={styles.grid}>
          {displayedPrograms.map((program) => (
            <article key={program.id} className={styles.card}>
              <div className={styles.imageBox}>
                <img 
                  src={program.image} 
                  alt={program.title}
                  className={styles.image}
                  loading="lazy"
                />
                <span className={styles.programBadge}>{program.badge}</span>
                <div className={styles.imageOverlay} />
              </div>

              <div className={styles.content}>
                <h3 className={styles.programTitle}>{program.title}</h3>
                <p className={styles.tagline}>{program.tagline}</p>
                <p className={styles.description}>{program.description}</p>

                {/* Meta details */}
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <Clock size={15} className={styles.metaIcon} />
                    <span>{program.duration}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Users size={15} className={styles.metaIcon} />
                    <span>{program.format}</span>
                  </div>
                </div>

                <div className={styles.targetBox}>
                  <div className={styles.targetLabel}>
                    <Target size={14} />
                    <span>Who it&rsquo;s for:</span>
                  </div>
                  <p className={styles.targetText}>{program.targetAudience}</p>
                </div>

                {/* Key Outcomes */}
                <div className={styles.outcomesWrapper}>
                  <h4 className={styles.outcomesTitle}>What You Gain:</h4>
                  <ul className={styles.outcomesList}>
                    {program.keyOutcomes.map((outcome, idx) => (
                      <li key={idx} className={styles.outcomeItem}>
                        <CheckCircle2 size={16} className={styles.checkIcon} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.cardFooter}>
                  <Link 
                    to="/Contact" 
                    className={styles.applyBtn}
                    aria-label={`Apply for ${program.title}`}
                  >
                    <span>Apply For Mentorship</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {isPreview ? (
          <div className={styles.viewMoreRow}>
            <Link to="/Features" className="btn-primary">
              <Sparkles size={18} />
              <span>View All Mentorship Tracks & Details</span>
            </Link>
          </div>
        ) : (
          <div className={styles.mentorCtaBanner}>
            <div className={styles.mentorCtaContent}>
              <h3>Are You An Experienced Professional?</h3>
              <p>
                Give back by guiding ambitious Kenyan youth. Join our mentor network across tech, finance, legal, creative, healthcare, and governance sectors.
              </p>
            </div>
            <Link to="/Contact" className="btn-secondary">
              <span>Register as a Mentor</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
