import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation/Navigation';
import WelcomeVideo from './components/WelcomeVideo/WelcomeVideo';
import Testimonials from './components/Testimonials/Testimonials';
import NextSteps from './components/NextSteps/NextSteps';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Footer from './components/Footer/Footer';
import CustomCursor from './components/UI/CustomCursor';
import LoadingScreen from './components/UI/LoadingScreen';

const QuantumScene = lazy(() => import('./components/QuantumScene/QuantumScene'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let raf: number | null = null;

    const handleScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
        setScrollProgress(progress);
        raf = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <LoadingScreen />
      <Suspense fallback={null}>
        <QuantumScene scrollProgress={scrollProgress} />
      </Suspense>
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <CustomCursor />
      <Navigation />
      <main>
        <WelcomeVideo />
        <div className="separator" />
        <Testimonials />
        <div className="separator" />
        <NextSteps />
        <div className="separator" />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}