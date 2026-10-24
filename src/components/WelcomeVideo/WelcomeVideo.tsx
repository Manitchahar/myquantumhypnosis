import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Button from '../UI/Button';
import { WELCOME_VIDEO_ID } from '../../config';
import styles from './WelcomeVideo.module.css';

export default function WelcomeVideo() {
  const [playing, setPlaying] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll('[data-intro]'));
    gsap.set(targets, { opacity: 0, y: 30 });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.12,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className={styles.section} id="welcome" aria-label="Welcome">
      <div className={styles.inner} ref={innerRef}>
        <div className={styles.header}>
          <img
            src="/crest-640.webp"
            alt="MyQuantumHypnosis crest: a wolf framed by olive branches, with the motto Manifest the Impossible"
            className={styles.crest}
            width={640}
            height={645}
            fetchPriority="high"
            data-intro
          />
          <span className={styles.eyebrow} data-intro>
            Welcome to MyQuantumHypnosis.com
          </span>
          <h1 className={styles.headline} data-intro>
            Manifest the <em>impossible.</em>
          </h1>
          <p className={styles.copy} data-intro>
            A personal welcome from Deyan: what Quantum Hypnosis is, who it may
            help and what you can expect from the experience.
          </p>
        </div>

        <div className={styles.videoWrapper} data-intro>
          <div className={styles.videoFrame}>
            {!playing ? (
              <>
                <div className={styles.posterPlaceholder}>
                  <img
                    src={`https://img.youtube.com/vi/${WELCOME_VIDEO_ID}/maxresdefault.jpg`}
                    alt=""
                    className={styles.posterImage}
                  />
                  <div className={styles.posterGradient} />
                </div>

                <button
                  className={styles.playButton}
                  onClick={() => setPlaying(true)}
                  aria-label="Play welcome video"
                >
                  <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    <path d="M26 22l16 10-16 10z" fill="currentColor" />
                  </svg>
                  <span className={styles.playLabel}>Watch the Welcome Video</span>
                </button>
              </>
            ) : (
              <div className={styles.iframeContainer}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${WELCOME_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Welcome to MyQuantumHypnosis.com"
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

        <div className={styles.ctas} data-intro>
          <Button variant="primary" size="lg" href="#book-call" showArrow>
            Book a Free 15-Min Call
          </Button>
          <Button variant="secondary" size="lg" href="#interview">
            Watch a Client Interview
          </Button>
        </div>
      </div>
    </section>
  );
}
