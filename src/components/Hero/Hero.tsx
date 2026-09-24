import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';
import Button from '../UI/Button';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const eyebrow = el.querySelector(`.${styles.eyebrow}`);
    const headline = el.querySelector(`.${styles.headline}`);
    const subtext = el.querySelector(`.${styles.subtext}`);
    const ctas = el.querySelector(`.${styles.ctas}`);
    const scrollCue = el.parentElement?.querySelector(`.${styles.scrollCue}`) as HTMLElement | null;

    const targets = [eyebrow, headline, subtext, ctas].filter(Boolean) as Element[];

    gsap.set(targets, {
      opacity: 0,
      y: 30,
    });
    if (scrollCue) gsap.set(scrollCue, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(eyebrow!, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
    })
    .to(headline!, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'expo.out',
    }, '-=0.7')
    .to(subtext!, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
    }, '-=0.7')
    .to(ctas!, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
    }, '-=0.6');

    if (scrollCue) {
      tl.to(scrollCue, {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
      }, '-=0.3');
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleScrollDown = () => {
    document.querySelector('#welcome')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="hero" aria-label="Hero">
      <div className={styles.content} ref={contentRef}>
        <div className={styles.eyebrow}>
          Quantum Hypnosis with Deyan
        </div>

        <h1 className={styles.headline}>
          Explore what lies<br />
          <em>beneath</em> the<br />
          conscious mind.
        </h1>

        <p className={styles.subtext}>
          A guided Quantum Hypnosis experience with Deyan designed to help you 
          explore your inner experience, gain greater clarity and discover new perspectives.
        </p>

        <div className={styles.ctas}>
          <Button variant="primary" size="lg" href="#lead-capture" showArrow>
            Begin Your Journey
          </Button>
          <Button variant="ghost" size="md" href="#welcome">
            <span className={styles.playIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2.5l10 5.5-10 5.5z" />
              </svg>
            </span>
            Watch Introduction
          </Button>
        </div>
      </div>

      <button
        className={styles.scrollCue}
        onClick={handleScrollDown}
        aria-label="Scroll to explore"
      >
        <span className={styles.scrollText}>Scroll to explore</span>
        <span className={styles.scrollLine} />
      </button>
    </section>
  );
}