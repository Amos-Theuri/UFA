// src/components/Officials.jsx
import styles from "./Officials.module.css";

// Import external JSON data directly
import officialsData from "../data/officials.json";

export default function Officials() {
  return (
    <section className={styles.section} aria-labelledby="officials-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="officials-heading" className={styles.title}>
            Leadership Team
          </h2>
          <p className={styles.subtitle}>
            Meet the officials guiding our vision, growth, and commitment to
            excellence.
          </p>
        </div>

        <div className={styles.grid}>
          {officialsData.map((official) => (
            <div key={official.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={official.image}
                  alt={official.name}
                  className={styles.avatar}
                  loading="lazy"
                />
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.name}>{official.name}</h3>
                <span className={styles.role}>{official.title}</span>
                <p className={styles.bio}>{official.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
