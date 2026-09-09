// src/components/PropositionBanner.jsx
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./PropositionBanner.module.css";

export default function PropositionBanner() {
  return (
    <section className={styles.section} aria-label="UFA Distinctive Proposition">
      <div className={styles.container}>
        <div className={styles.badge}>
          <Sparkles size={16} />
          <span>Our Distinctive Proposition</span>
        </div>

        <h2 className={styles.title}>
          Where Youth Development Meets <span className={styles.highlight}>Real Community Impact</span>
        </h2>

        <p className={styles.quote}>
          &ldquo;We don&rsquo;t only ask, &lsquo;How can young people succeed?&rsquo; We also ask,
          &lsquo;How can empowered young people use their skills, networks, and opportunities to help their communities?&rsquo;&rdquo;
        </p>

        {/* The Authentic UFA Formula */}
        <div className={styles.formulaWrapper}>
          <div className={styles.formulaLabel}>The UFA Model:</div>
          <div className={styles.formulaPills}>
            <span className={styles.pill}>Youth Networking</span>
            <span className={styles.operator}>+</span>
            <span className={styles.pill}>Mentorship</span>
            <span className={styles.operator}>+</span>
            <span className={styles.pill}>Career Development</span>
            <span className={styles.operator}>+</span>
            <span className={styles.pill}>Empowerment</span>
            <span className={styles.operator}>+</span>
            <span className={styles.pill}>Community Engagement</span>
            <span className={styles.equals}>=</span>
            <span className={styles.resultPill}>
              <Sparkles size={16} />
              Community Impact
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/Features" className="btn-primary">
            <span>Explore Our Programmes</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/Contact" className="btn-secondary">
            <span>Join Our Network</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
