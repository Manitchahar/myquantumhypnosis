import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitalRingProps {
  progress: number;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  color: string;
  opacity?: number;
}

export default function OrbitalRing({
  progress,
  radius,
  speed,
  tilt,
  color,
  opacity = 0.15,
}: OrbitalRingProps) {
  const groupRef = useRef<THREE.Group>(null);

  const points: [number, number, number][] = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    points.push([Math.cos(t) * radius, 0, Math.sin(t) * radius]);
  }

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = t * speed;
    groupRef.current.rotation.x = tilt[0] + Math.sin(t * 0.2) * 0.05;
    groupRef.current.rotation.y = tilt[1] + Math.cos(t * 0.15) * 0.05;
  });

  const currentOpacity = opacity * Math.min(progress * 2, 1);

  return (
    <group ref={groupRef} rotation={tilt}>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={currentOpacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </group>
  );
}