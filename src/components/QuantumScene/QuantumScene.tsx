import { Suspense, useRef, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ConsciousnessObject from './ConsciousnessObject';
import OrbitalRing from './OrbitalRing';
import AmbientParticles from './AmbientParticles';
import CoreGlow from './CoreGlow';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './QuantumScene.module.css';

interface SceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  quality: 'high' | 'medium' | 'low';
  reducedMotion: boolean;
}

function CameraRig({ scrollProgress, mousePos, reducedMotion }: Omit<SceneProps, 'quality'>) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(() => {
    if (reducedMotion) return;

    const t = scrollProgress;
    const z = 8 - t * 3.5;
    const y = Math.sin(t * Math.PI) * 0.5;

    targetPos.current.set(
      mousePos.x * 0.3,
      y + mousePos.y * 0.2,
      z
    );

    camera.position.lerp(targetPos.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({ scrollProgress, mousePos, quality, reducedMotion }: SceneProps) {
  return (
    <>
      <CameraRig
        scrollProgress={scrollProgress}
        mousePos={mousePos}
        reducedMotion={reducedMotion}
      />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#6b5ce7" />
      <pointLight position={[-3, -2, 3]} intensity={0.2} color="#c9a96e" />

      <ConsciousnessObject
        progress={scrollProgress}
        mousePos={mousePos}
        quality={quality}
      />

      <CoreGlow progress={scrollProgress} />

      {/* Orbital rings - appear as structure forms */}
      <OrbitalRing
        progress={scrollProgress}
        radius={3.0}
        speed={0.08}
        tilt={[0.3, 0, 0.2]}
        color="#6b5ce7"
        opacity={0.08}
      />
      <OrbitalRing
        progress={scrollProgress}
        radius={3.5}
        speed={-0.05}
        tilt={[1.2, 0.5, 0]}
        color="#4a3f8a"
        opacity={0.06}
      />
      <OrbitalRing
        progress={scrollProgress}
        radius={2.8}
        speed={0.12}
        tilt={[0.8, 1.0, 0.3]}
        color="#c9a96e"
        opacity={0.04}
      />

      <AmbientParticles quality={quality} />
    </>
  );
}

interface QuantumSceneProps {
  scrollProgress: number;
}

export default function QuantumScene({ scrollProgress }: QuantumSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  const quality: 'high' | 'medium' | 'low' = reducedMotion
    ? 'low'
    : isMobile
    ? 'low'
    : window.devicePixelRatio > 1.5
    ? 'medium'
    : 'high';

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      });
    },
    [reducedMotion]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

  return (
    <div
      ref={containerRef}
      className={styles.scene}
      onMouseMove={handleMouseMove}
      role="img"
      aria-label="Interactive 3D visualization representing consciousness exploration"
    >
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
          dpr={dpr}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <Scene
              scrollProgress={scrollProgress}
              mousePos={mousePos}
              quality={quality}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}