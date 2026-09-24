import { useState } from 'react';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import styles from './Process.module.css';

const STAGES = [
  {
    num: '01',
    title: 'Connect',
    desc: 'Tell us what you\'re hoping to explore. We begin with a conversation to understand your intentions and answer any questions.',
    state: 'Scattered particles begin attracting toward a structure',
  },
  {
    num: '02',
    title: 'Prepare',
    desc: 'Learn how the session works and how to get ready. We guide you through the process so you feel comfortable and informed.',
    state: 'Orbital paths stabilize',
  },
  {
    num: '03',
    title: 'Experience',
    desc: 'Begin your guided Quantum Hypnosis session with Deyan. A deeply personal journey of exploration and discovery.',
    state: 'The structure becomes coherent, transparent and luminous',
  },
];

export default function Process() {
  const { ref, progress } = useSectionProgress();
  const [playing, setPlaying] = useState(false);
  const opacity = Math.min(progress * 3, 1);
  const translateY = (1 - Math.min(progress * 2.5, 1)) * 30;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      id="process"
      aria-label="How it works"
    >
      <div className={styles.inner} style={{ opacity, transform: `translateY(${translateY}px)` }}>
        <div className={styles.header}>
          <span className="section-marker">03 / The Process</span>
          <h2 className={styles.headline}>
            From curiosity<br />to <em>clarity.</em>
          </h2>
          <p className={styles.copy}>
            Discover how a Quantum Hypnosis session works, what the experience
            involves and how to prepare.
          </p>
        </div>

        <div className={styles.stages}>
          {STAGES.map((stage, i) => {
            const stageProgress = Math.max(0, Math.min(1, (progress - i * 0.2) * 3));
            return (
              <div
                key={stage.num}
                className={styles.stage}
                style={{
                  opacity: 0.15 + stageProgress * 0.85,
                  transform: `translateY(${(1 - stageProgress) * 20}px)`,
                }}
              >
                <div className={styles.stageNum}>
                  <span className={styles.stageNumText}>{stage.num}</span>
                  <span className={styles.stageLine} style={{ transform: `scaleX(${stageProgress})` }} />
                </div>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p className={styles.stageDesc}>{stage.desc}</p>
                <div className={styles.stageState}>
                  <span className={styles.stateDot} style={{ opacity: stageProgress }} />
                  <span className={styles.stateText}>{stage.state}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.videoContainer}>
          <div className={styles.videoFrame}>
            {!playing ? (
              <div className={styles.videoPlaceholder}>
                <img
                  src="https://img.youtube.com/vi/t-wzh4Ta_vo/maxresdefault.jpg"
                  alt="How Quantum Hypnosis Works"
                  className={styles.posterImage}
                />
                <div className={styles.posterGradient} />
                <button
                  className={styles.playButton}
                  onClick={() => setPlaying(true)}
                  aria-label="Play process explainer video"
                >
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                    <path d="M26 22l16 10-16 10z" fill="currentColor" />
                  </svg>
                  <span className={styles.playLabel}>Watch The Process</span>
                </button>
              </div>
            ) : (
              <div className={styles.iframeContainer}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/t-wzh4Ta_vo?autoplay=1&rel=0"
                  title="Unlock Your Natural Healing Abilities with QuantumHypnosis"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className={styles.iframe}
                />
                <button
                  onClick={() => setPlaying(false)}
                  className={styles.closeVideo}
                  aria-label="Close video"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}