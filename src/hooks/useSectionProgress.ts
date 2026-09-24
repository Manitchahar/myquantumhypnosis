import { useEffect, useRef, useState } from 'react';

export function useSectionProgress(threshold = 0.01) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number | null = null;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      
      const start = vh;
      const end = -rect.height;
      const current = rect.top;
      
      const raw = 1 - (current - end) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      
      setProgress(prev => {
        if (Math.abs(prev - clamped) < threshold) return prev;
        return clamped;
      });
      
      raf = null;
    }

    function onScroll() {
      if (raf === null) {
        raf = requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return { ref, progress };
}