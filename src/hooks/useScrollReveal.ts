import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  threshold?: string;
}

export function useScrollReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');
    const targets = children.length > 0 ? children : [el];

    gsap.set(targets, {
      opacity: 0,
      y: options.y ?? 40,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: options.threshold ?? 'top 85%',
        once: true,
      },
    });

    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration: options.duration ?? 1.2,
      ease: 'expo.out',
      stagger: options.stagger ?? 0.12,
      delay: options.delay ?? 0,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return ref;
}