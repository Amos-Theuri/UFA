// src/components/Officials.jsx
import { Award, Sparkles } from "lucide-react";
import styles from "./Officials.module.css";
import officialsData from "../data/officials.json";

// Import all official leadership photos from assets
import official1 from "../assets/official_1.jpeg";
import official2 from "../assets/official_2.jpeg";
import official3 from "../assets/official_3.jpeg";
import official4 from "../assets/official_4.jpeg";
import official5 from "../assets/official_5.jpeg";
import official6 from "../assets/official_6.jpeg";
import official7 from "../assets/official_7.jpg";

// Map JSON paths and IDs to bundled assets
const assetMap = {
  1: official1,
  2: official5,
  3: official4,
  4: official3,
  5: official6,
  6: official2,
  7: official7,
  8: official7,
  9: official7,
  10: official7,
  11: official7,
  "/officials/official_1.jpeg": official1,
  "/officials/official_2.jpeg": official2,
  "/officials/official_3.jpeg": official3,
  "/officials/official_4.jpeg": official4,
  "/officials/official_5.jpeg": official5,
  "/officials/official_6.jpeg": official6,
  "/officials/official_7.jpg": official7,
  "/officials/official_7.jpeg": official7,
  "official_1.jpeg": official1,
  "official_2.jpeg": official2,
  "official_3.jpeg": official3,
  "official_4.jpeg": official4,
  "official_5.jpeg": official5,
  "official_6.jpeg": official6,
  "official_7.jpg": official7,
  "official_7.jpeg": official7,
};

function resolveOfficialImage(official) {
  if (!official) return official1;
  const imagePath = typeof official === "string" ? official : official.image;
  const id = typeof official === "object" ? official.id : null;

  if (id && assetMap[id]) return assetMap[id];
  if (imagePath && assetMap[imagePath]) return assetMap[imagePath];
  if (imagePath) {
    const filename = imagePath.split("/").pop();
    if (filename && assetMap[filename]) return assetMap[filename];
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    const base = import.meta.env.BASE_URL || "/";
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${base}${cleanPath}`;
  }
  return official1;
}

export default function Officials() {
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
            Dedicated visionary officials steering UFA’s national mission, county chapters, and youth empowerment initiatives across Kenya.
          </p>
        </div>

        <div className={styles.grid}>
          {officialsData.map((official) => {
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
