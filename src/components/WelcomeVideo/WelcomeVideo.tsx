import { useRef, useState } from 'react';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import styles from './WelcomeVideo.module.css';

export default function WelcomeVideo() {
  const { ref, progress } = useSectionProgress();
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const opacity = Math.min(progress * 3, 1);
  const translateY = (1 - Math.min(progress * 2.5, 1)) * 40;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      id="welcome"
      aria-label="Welcome video"
    >
      <div
        className={styles.inner}
        style={{ opacity, transform: `translateY(${translateY}px)` }}
      >
        <div className={styles.header}>
          <span className="section-marker">01 / Welcome</span>
          <h2 className={styles.headline}>
            Your journey begins<br />with <em>understanding.</em>
          </h2>
          <p className={styles.copy}>
            Meet Deyan and discover what Quantum Hypnosis is, who it may be 
            relevant for and what you can expect from the experience.
          </p>
        </div>

        <div className={styles.videoWrapper} ref={containerRef}>
          <div className={styles.videoFrame}>
            <div className={styles.posterPlaceholder}>
              <div className={styles.posterGradient} />
              <span className={styles.posterLabel}>[ Welcome Video — Placeholder ]</span>
              <span className={styles.posterSub}>
                Replace with Deyan's introduction video
              </span>
            </div>

            {!playing && (
              <button
                className={styles.playButton}
                onClick={() => setPlaying(true)}
                aria-label="Play welcome video"
              >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <path d="M26 22l16 10-16 10z" fill="currentColor" />
                </svg>
                <span className={styles.playLabel}>Play Introduction</span>
              </button>
            )}

            {playing && (
              <div className={styles.videoPlaceholder}>
                <p>[ Video player would be embedded here ]</p>
                <button onClick={() => setPlaying(false)} className={styles.closeVideo}>
                  Close
                </button>
              </div>
            )}
          </div>

          <span className={styles.videoLabel}>Featured Welcome Video</span>
        </div>

        <div className={styles.footer}>
          <a href="#lead-capture" className={styles.meetLink}>
            Meet Deyan
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}