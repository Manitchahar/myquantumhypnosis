import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AmbientParticlesProps {
  count?: number;
  quality: 'high' | 'medium' | 'low';
}

export default function AmbientParticles({ count = 200, quality }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const actualCount = quality === 'low' ? Math.floor(count * 0.3) : quality === 'medium' ? Math.floor(count * 0.6) : count;

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3);
    const sizes = new Float32Array(actualCount);
    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, sizes };
  }, [actualCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.05;
    pointsRef.current.rotation.y = t;
    pointsRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation
        transparent
        opacity={0.15}
        color="#6b5ce7"
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}