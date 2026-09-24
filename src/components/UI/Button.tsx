import { useRef, useCallback, type MouseEvent } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  showArrow?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  showArrow = false,
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty('--mx', `${x * 0.15}px`);
    el.style.setProperty('--my', `${y * 0.15}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '0px');
    el.style.setProperty('--my', '0px');
  }, []);

  const classes = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  const sharedProps = {
    ref: ref as React.RefObject<HTMLElement>,
    className: classes,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    'data-arrow': showArrow ? 'true' : undefined,
  };

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {showArrow && (
        <span className={styles.arrow} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 10h10M11 6l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a {...(sharedProps as any)} href={href} role="link">
        {content}
      </a>
    );
  }

  return (
    <button
      {...(sharedProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}