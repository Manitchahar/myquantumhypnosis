import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/crest-160.webp" alt="" className={styles.crest} width={96} height={96} loading="lazy" />
          <span className={styles.brandText}>MyQuantumHypnosis.com</span>
          <span className={styles.brandSub}>Deyan · Manifest the Impossible</span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <a href="#" className={styles.link}>Privacy</a>
          <a href="#" className={styles.link}>Terms</a>
          <a href="#" className={styles.link}>Contact</a>
        </nav>

        <p className={styles.disclaimer}>
          Quantum Hypnosis is presented as a personal exploration and wellbeing experience.
          Individual experiences vary. Information on this website should not be interpreted
          as medical or mental-health treatment or as a guarantee of any particular outcome.
        </p>
      </div>
    </footer>
  );
}