import { createContext, useContext } from 'react';

interface ScrollContextValue {
  progress: number;
  velocity: number;
  sectionProgress: Record<string, number>;
}

export const ScrollContext = createContext<ScrollContextValue>({
  progress: 0,
  velocity: 0,
  sectionProgress: {},
});

export function useScrollContext() {
  return useContext(ScrollContext);
}