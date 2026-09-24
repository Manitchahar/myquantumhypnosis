import { useRef } from 'react';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import styles from './Masterclass.module.css';

export default function Masterclass() {
  const { ref, progress } = useSectionProgress();
  const cardRef = useRef<HTMLDivElement>(null);

  const opacity = Math.min(progress * 2.5, 1);
  const translateY = (1 - Math.min(progress * 2, 1)) * 30;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      id="masterclass"
      aria-label="Masterclass and resources"
    >
      <div className={styles.inner} style={{ opacity, transform: `translateY(${translateY}px)` }}>
        <div className={styles.header}>
          <span className="section-marker">04 / Learn</span>
          <h2 className={styles.headline}>
            Explore before<br />you <em>experience.</em>
          </h2>
          <p className={styles.copy}>
            Start with a free educational resource designed to give you a clearer
            understanding of Quantum Hypnosis.
          </p>
        </div>

        {/* Primary offer */}
        <div className={styles.primaryCard} ref={cardRef}>
          <div className={styles.cardGlow} />
          <div className={styles.cardContent}>
            <span className={styles.cardBadge}>Free</span>
            <span className={styles.cardDuration}>40-Minute Masterclass</span>
            <h3 className={styles.cardTitle}>
              What Is Quantum Hypnosis?
            </h3>
            <p className={styles.cardDesc}>
              What to Expect, What It Can Change, and How to Prepare.
            </p>
            <div className={styles.cardPoster}>
              <div className={styles.posterInner}>
                <span className={styles.posterLabel}>[ Masterclass Thumbnail — Placeholder ]</span>
                <span className={styles.posterSub}>Replace with masterclass artwork</span>
              </div>
            </div>
            <a href="#" className={styles.cardCta}>
              Watch the Masterclass
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Secondary offers */}
        <div className={styles.secondary}>
          <div className={styles.secondaryCard}>
            <div className={styles.secondaryContent}>
              <span className={styles.secondaryLabel}>Series</span>
              <h4 className={styles.secondaryTitle}>
                The Quantum Hypnosis Starter Series
              </h4>
              <p className={styles.secondaryDesc}>
                A three-part mini-course exploring the method, the experience and the next steps.
              </p>
              <a href="#" className={styles.secondaryCta}>
                Start the Series
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.secondaryCard}>
            <div className={styles.secondaryContent}>
              <span className={styles.secondaryLabel}>Guide + Audio</span>
              <h4 className={styles.secondaryTitle}>
                7 Questions to Ask Before Your First Quantum Hypnosis Session
              </h4>
              <p className={styles.secondaryDesc}>
                Includes a short guided audio experience.
              </p>
              <a href="#" className={styles.secondaryCta}>
                Get the Guide
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}