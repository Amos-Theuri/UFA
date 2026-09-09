// src/components/PartnersSection.jsx
import { strategicPartners } from "../data/partners";
import { Handshake, ExternalLink, Sparkles } from "lucide-react";
import styles from "./PartnersSection.module.css";

export default function PartnersSection() {
  return (
    <section className={styles.section} id="partners-section" aria-labelledby="partners-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Handshake size={16} />
            <span>Strategic Collaborations</span>
          </div>
          <h2 id="partners-heading" className={styles.title}>
            Our Strategic Partners & Collaborators
          </h2>
          <p className={styles.subtitle}>
            We work hand-in-hand with leading foundations, leadership hubs, corporate innovators, and community networks to expand real opportunities for Kenyan youth.
          </p>
        </div>

        <div className={styles.grid}>
          {strategicPartners.map((partner) => (
            <div key={partner.id} className={styles.partnerCard}>
              <div className={styles.topRow}>
                {partner.image ? (
                  <div className={styles.partnerImgBox}>
                    <img src={partner.image} alt={`${partner.name} Logo`} />
                  </div>
                ) : (
                  <div className={styles.partnerBadgeIcon}>
                    <Sparkles size={24} />
                  </div>
                )}
                <span className={styles.partnerTag}>{partner.tag}</span>
              </div>

              <h3 className={styles.partnerName}>
                {partner.website ? (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.partnerLink}
                  >
                    <span>{partner.name}</span>
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <span>{partner.name}</span>
                )}
              </h3>

              <div className={styles.partnerRole}>{partner.role}</div>
              <p className={styles.partnerDesc}>{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
