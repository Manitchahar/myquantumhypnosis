import { useSectionProgress } from '../../hooks/useSectionProgress';
import Button from '../UI/Button';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  const { ref, progress } = useSectionProgress();
  const opacity = Math.min(progress * 2, 1);
  const translateY = (1 - Math.min(progress * 1.5, 1)) * 40;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      aria-label="Final call to action"
    >
      <div className={styles.inner} style={{ opacity, transform: `translateY(${translateY}px)` }}>
        <h2 className={styles.headline}>
          Sometimes clarity begins<br />with a <em>question.</em>
        </h2>
        <p className={styles.copy}>
          Discover whether Quantum Hypnosis is something you would like to explore.
        </p>
        <div className={styles.ctas}>
          <Button variant="primary" size="lg" href="#lead-capture" showArrow>
            Begin Your Journey
          </Button>
          <Button variant="ghost" size="md" href="#welcome">
            <span className={styles.playIcon} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2.5l10 5.5-10 5.5z" />
              </svg>
            </span>
            Watch the Introduction
          </Button>
        </div>
      </div>
    </section>
  );
}