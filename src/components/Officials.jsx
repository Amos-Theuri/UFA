// src/components/Officials.jsx
import { useState, useEffect } from "react";
import { Award, Sparkles } from "lucide-react";
import styles from "./Officials.module.css";
import officialsData from "../data/officials.json";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

// Import all official leadership photos from assets
import official1 from "../assets/official_1.jpeg";
import official2 from "../assets/official_2.jpeg";
import official3 from "../assets/official_3.jpeg";
import official4 from "../assets/official_4.jpeg";
import official5 from "../assets/official_5.jpeg";
import official6 from "../assets/official_6.jpeg";
import official7 from "../assets/official_7.jpg";
import official8 from "../assets/official_8.jpeg";
import official9 from "../assets/official_9.jpeg";
import official11 from "../assets/official_11.jpeg";

// Map JSON paths and IDs to bundled assets
const assetMap = {
  1: official1,
  2: official5,
  3: official4,
  4: official3,
  5: official6,
  6: official2,
  7: official7,
  8: official8,
  9: official9,
  10: official7,
  11: official11,
  "/officials/official_1.jpeg": official1,
  "/officials/official_2.jpeg": official2,
  "/officials/official_3.jpeg": official3,
  "/officials/official_4.jpeg": official4,
  "/officials/official_5.jpeg": official5,
  "/officials/official_6.jpeg": official6,
  "/officials/official_7.jpg": official7,
  "/officials/official_7.jpeg": official7,
  "/officials/official_8.jpeg": official8,
  "/officials/official_8.jpg": official8,
  "/officials/official_9.jpeg": official9,
  "/officials/official_9.jpg": official9,
  "/officials/official_11.jpeg": official11,
  "/officials/official_11.jpg": official11,
  "official_1.jpeg": official1,
  "official_2.jpeg": official2,
  "official_3.jpeg": official3,
  "official_4.jpeg": official4,
  "official_5.jpeg": official5,
  "official_6.jpeg": official6,
  "official_7.jpg": official7,
  "official_7.jpeg": official7,
  "official_8.jpeg": official8,
  "official_8.jpg": official8,
  "official_9.jpeg": official9,
  "official_9.jpg": official9,
  "official_11.jpeg": official11,
  "official_11.jpg": official11,
};

function resolveOfficialImage(official) {
  if (!official) return official1;
  const imagePath = typeof official === "string" ? official : (official.image || official.image_url);
  const id = typeof official === "object" ? official.id : null;

  if (id && assetMap[id]) return assetMap[id];
  if (imagePath && assetMap[imagePath]) return assetMap[imagePath];
  if (imagePath) {
    const filename = imagePath.split("/").pop();
    if (filename && assetMap[filename]) return assetMap[filename];
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    const base = import.meta.env.BASE_URL || "/";
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    return `${base}${cleanPath}`;
  }
  return official1;
}

export default function Officials() {
  const [officialsList, setOfficialsList] = useState(officialsData);

  useEffect(() => {
    async function fetchOfficials() {
      if (!isSupabaseConfigured || !supabase) return;

      try {
        const { data, error } = await supabase
          .from("officials")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const normalized = data.map((item) => ({
            ...item,
            image: item.image || item.image_url
          }));
          setOfficialsList(normalized);
        }
      } catch (err) {
        console.warn("Could not fetch remote officials, using local default:", err);
      }
    }

    fetchOfficials();
  }, []);

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
          {officialsList.map((official) => {
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
