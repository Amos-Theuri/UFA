// src/components/WhoCanParticipateSection.jsx
import { Link } from "react-router-dom";
import { whoCanParticipate } from "../data/ufaCore";
import { Sparkles, Users, HeartHandshake } from "lucide-react";
import styles from "./WhoCanParticipateSection.module.css";

export default function WhoCanParticipateSection() {
  return (
    <section className={styles.section} id="who-can-participate" aria-labelledby="participate-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Users size={16} />
            <span>Open & Inclusive Community</span>
          </div>
          <h2 id="participate-heading" className={styles.title}>
            Who Can Participate in UFA?
          </h2>
          <p className={styles.subtitle}>
            You don&rsquo;t have to be established or influential to belong to UFA. You can join to learn, connect, contribute, volunteer, mentor, partner, or receive support.
          </p>
        </div>

        <div className={styles.grid}>
          {whoCanParticipate.map((persona) => {
            const Icon = persona.icon;
            return (
              <div key={persona.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconCircle}>
                    <Icon size={24} />
                  </div>
                  <span className={styles.roleBadge}>{persona.role}</span>
                </div>
                <h3 className={styles.cardTitle}>{persona.title}</h3>
                <p className={styles.cardDesc}>{persona.description}</p>
              </div>
            );
          })}
        </div>

        <div className={styles.invitationCard}>
          <div className={styles.invitationContent}>
            <div className={styles.invitationIconBox}>
              <HeartHandshake size={32} />
            </div>
            <div>
              <h3>Find Your Place in Kenya&rsquo;s Youth Movement</h3>
              <p>
                Whether you want to gain skills, discover a mentor, give back to your county, or sponsor youth programs, there is a place for you here.
              </p>
            </div>
          </div>
          <Link to="/Contact" className="btn-primary">
            <Sparkles size={18} />
            <span>Join UFA Today</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
