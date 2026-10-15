// src/components/Officials.jsx
import { useState, useEffect } from "react";
import { Award, Sparkles } from "lucide-react";
import styles from "./Officials.module.css";
import {
  getOfficials,
  subscribeToOfficials,
  fetchOfficialsFromSupabase
} from "../services/officialsService";
import { resolveOfficialImage } from "../lib/assetResolvers";
import official1 from "../assets/official_1.jpeg";

export default function Officials() {
  const [officialsList, setOfficialsList] = useState(() => getOfficials());

  useEffect(() => {
    fetchOfficialsFromSupabase().then((latest) => {
      if (latest && latest.length > 0) {
        setOfficialsList(latest);
      }
    });

    const unsubscribe = subscribeToOfficials((updated) => {
      setOfficialsList(updated);
    });
    return unsubscribe;
  }, []);

  const activeOfficials = officialsList.filter((o) => o.isActive !== false);

  return (
    <section className={styles.section} aria-labelledby="officials-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Governance & Leadership</span>
          </div>
          <h2 id="officials-heading" className={styles.title}>
            Meet Our Leadership Team
          </h2>
          <p className={styles.subtitle}>
            Dedicated visionary officials steering UFA’s national mission,
            county chapters, and youth empowerment initiatives across Kenya.
          </p>
        </div>

        <div className={styles.grid}>
          {activeOfficials.map((official) => {
            const imgSrc = resolveOfficialImage(official);
            return (
              <article key={official.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={imgSrc}
                    alt={`${official.name} - ${official.title}`}
                    className={styles.avatar}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = official1;
                    }}
                  />
                  <div className={styles.imageOverlay} />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.roleBadge}>
                    <Award size={13} className={styles.roleIcon} />
                    <span>{official.title}</span>
                  </div>
                  <h3 className={styles.name}>{official.name}</h3>
                  <p className={styles.bio}>{official.bio}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
