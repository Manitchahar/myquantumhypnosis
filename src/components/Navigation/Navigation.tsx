import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { label: 'Experience', href: '#welcome' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Process', href: '#process' },
  { label: 'Masterclass', href: '#masterclass' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 50);
    if (y > lastScrollY.current && y > 300) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label="MyQuantumHypnosis home">
          <span className={styles.brandText}>My Quantum Hypnosis</span>
        </a>

        <div className={`${styles.links} ${mobileOpen ? styles.linksOpen : ''}`}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={styles.link}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.actions}>
          <a href="#lead-capture" className={styles.cta} onClick={(e) => handleNavClick(e, '#lead-capture')}>
            Begin Your Journey
          </a>
          <button
            className={styles.burger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.burgerOpen : ''}`} />
            <span className={`${styles.burgerLine} ${mobileOpen ? styles.burgerOpen : ''}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}