import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from './shaders';

interface Props {
  progress: number;
  mousePos: { x: number; y: number };
  quality: 'high' | 'medium' | 'low';
}

const PARTICLE_COUNTS = { high: 2800, medium: 1400, low: 600 };

export default function ConsciousnessObject({ progress, mousePos, quality }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const count = PARTICLE_COUNTS[quality];

  const { positions, targets, phases, sizes, delays } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const delays = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;

      // Target: points on a sphere/ellipsoid with some structure
      const layerR = 0.6 + Math.random() * 1.6;
      const layerPhi = Math.acos(2 * ((i / count) * 0.8 + 0.1 * Math.random()) - 1);
      const layerTheta = theta + Math.sin(layerPhi * 3) * 0.5;
      
      targets[i3] = Math.sin(layerPhi) * Math.cos(layerTheta) * layerR;
      targets[i3 + 1] = Math.sin(layerPhi) * Math.sin(layerTheta) * layerR * 0.85;
      targets[i3 + 2] = Math.cos(layerPhi) * layerR;

      // Initial positions: scattered
      const scatter = 4.0 + Math.random() * 3.0;
      positions[i3] = Math.sin(phi) * Math.cos(theta) * scatter + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * scatter + (Math.random() - 0.5) * 2;
      positions[i3 + 2] = Math.cos(phi) * scatter + (Math.random() - 0.5) * 2;

      phases[i] = Math.random();
      sizes[i] = 1.5 + Math.random() * 3.5;
      delays[i] = Math.random() * 0.6;
    }

    return { positions, targets, phases, sizes, delays };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uIntensity: { value: 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useEffect(() => {
    const points = pointsRef.current;
    if (!points) return;
    const geo = points.geometry;
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
  }, [positions, targets, phases, sizes, delays]);

  useFrame((state) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uProgress.value = THREE.MathUtils.lerp(u.uProgress.value, progress, 0.05);
    u.uMouse.value.set(
      THREE.MathUtils.lerp(u.uMouse.value.x, mousePos.x, 0.05),
      THREE.MathUtils.lerp(u.uMouse.value.y, mousePos.y, 0.05)
    );
    // Fade out intensity as you scroll past 60%
    const fadeOut = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 1;
    u.uIntensity.value = (quality === 'low' ? 0.8 : 1.0) * Math.max(fadeOut, 0.05);
  });

  const frustumCulled = false;

  return (
    <points ref={pointsRef} frustumCulled={frustumCulled}>
      <bufferGeometry />
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}