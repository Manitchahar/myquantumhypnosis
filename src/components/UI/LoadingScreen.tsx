import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFading(true), 800);
    const timer2 = setTimeout(() => setVisible(false), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.screen} ${fading ? styles.fading : ''}`} aria-hidden="true">
      <div className={styles.content}>
        <div className={styles.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="12" stroke="#6b5ce7" strokeWidth="0.5" opacity="0.4" />
            <circle cx="20" cy="20" r="6" stroke="#c9a96e" strokeWidth="0.3" opacity="0.3" />
            <circle cx="20" cy="20" r="2" fill="#f0ece4" opacity="0.6" />
          </svg>
        </div>
        <div className={styles.bar}>
          <div className={styles.barFill} />
        </div>
      </div>
    </div>
  );
}