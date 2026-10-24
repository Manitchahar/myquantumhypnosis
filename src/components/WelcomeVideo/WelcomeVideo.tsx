import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Button from '../UI/Button';
import YouTubePlayer from '../UI/YouTubePlayer';
import { WELCOME_VIDEO_ID } from '../../config';
import styles from './WelcomeVideo.module.css';

export default function WelcomeVideo() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll('[data-intro]'));
    gsap.set(targets, { opacity: 0, y: 30 });

    const tl = gsap.timeline({ delay: 0.9 });
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
            <YouTubePlayer
              videoId={WELCOME_VIDEO_ID}
              title="Welcome to MyQuantumHypnosis.com"
              caption="Watch the Welcome Video"
            />
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
