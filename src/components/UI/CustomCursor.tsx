import { useEffect, useRef, useState, useCallback } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  // Only for a real mouse: on touch screens the ring would sit stranded in a corner
  const hasMouse = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const [variant, setVariant] = useState<'default' | 'link' | 'play'>('default');
  const [moved, setMoved] = useState(false);

  const animate = useCallback(() => {
    pos.current.x += (target.current.x - pos.current.x) * 0.12;
    pos.current.y += (target.current.y - pos.current.y) * 0.12;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!hasMouse || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setMoved(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a, button, [role="button"]')) {
        const isPlay = el.closest('[aria-label*="play" i], [aria-label*="Play" i]');
        setVariant(isPlay ? 'play' : 'link');
      } else {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(raf.current);
    };
  }, [hasMouse, reducedMotion, animate]);

  if (!hasMouse || reducedMotion || !moved) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${styles[variant]}`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={styles.dot}
        aria-hidden="true"
      />
    </>
  );
}