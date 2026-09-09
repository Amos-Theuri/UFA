// src/components/ImpactPathwaySection.jsx
import { impactPathway } from "../data/ufaCore";
import { Sparkles, ArrowRight } from "lucide-react";
import styles from "./ImpactPathwaySection.module.css";

export default function ImpactPathwaySection() {
  return (
    <section className={styles.section} aria-labelledby="pathway-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Our Approach</span>
          </div>
          <h2 id="pathway-heading" className={styles.title}>
            The UFA Impact Pathway
          </h2>
          <p className={styles.subtitle}>
            Youth development should not end with personal success. Our work follows a clear, transformative pathway from personal growth to collective community leadership.
          </p>
        </div>

        <div className={styles.timeline}>
          {impactPathway.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepIndicator}>
                  <span className={styles.stepNumber}>0{step.step}</span>
                  {idx < impactPathway.length - 1 && (
                    <span className={styles.connectorLine} />
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.iconCircle}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.stepName}>{step.name}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.pathwaySummary}>
          <p>
            <strong>Connect</strong> <ArrowRight size={14} className={styles.inlineArrow} /> 
            <strong>Mentor</strong> <ArrowRight size={14} className={styles.inlineArrow} /> 
            <strong>Empower</strong> <ArrowRight size={14} className={styles.inlineArrow} /> 
            <strong>Lead</strong> <ArrowRight size={14} className={styles.inlineArrow} /> 
            <strong>Serve</strong> <ArrowRight size={14} className={styles.inlineArrow} /> 
            <strong className={styles.finalGoal}>Create Impact</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
