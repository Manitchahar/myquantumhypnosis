import { useEffect, useRef, useCallback } from 'react';

interface ScrollProgressState {
  progress: number;
  velocity: number;
}

const listeners = new Set<(state: ScrollProgressState) => void>();
let currentProgress = 0;
let currentVelocity = 0;
let rafId: number | null = null;
let lastScroll = 0;
let lastTime = 0;

function updateProgress() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
  
  const now = performance.now();
  const dt = now - lastTime;
  if (dt > 0) {
    const rawVelocity = Math.abs(scrollY - lastScroll) / dt;
    currentVelocity = currentVelocity * 0.9 + rawVelocity * 0.1;
  }
  lastScroll = scrollY;
  lastTime = now;
  
  currentProgress = progress;
  listeners.forEach(fn => fn({ progress, velocity: currentVelocity }));
  rafId = null;
}

function onScroll() {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateProgress);
  }
}

export function useScrollProgress(
  callback: (state: ScrollProgressState) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const stableCallback = useCallback(
    (state: ScrollProgressState) => callbackRef.current(state),
    []
  );

  useEffect(() => {
    listeners.add(stableCallback);
    
    if (listeners.size === 1) {
      window.addEventListener('scroll', onScroll, { passive: true });
      lastTime = performance.now();
      onScroll();
    }

    return () => {
      listeners.delete(stableCallback);
      if (listeners.size === 0 && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [stableCallback]);
}

export function getGlobalScrollProgress(): number {
  return currentProgress;
}