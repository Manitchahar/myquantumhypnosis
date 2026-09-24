import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandText}>MyQuantumHypnosis.com</span>
          <span className={styles.brandSub}>Deyan</span>
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