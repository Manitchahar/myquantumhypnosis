import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreGlowProps {
  progress: number;
}

export default function CoreGlow({ progress }: CoreGlowProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!matRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progress;

    // Fade out after 60% scroll
    const fadeOut = p > 0.6 ? 1 - (p - 0.6) / 0.4 : 1;
    const fadedP = p * Math.max(fadeOut, 0.05);

    // Scale pulses gently, grows with progress
    const baseScale = 0.15 + fadedP * 0.5;
    const pulse = 1 + Math.sin(t * 1.5) * 0.03 * (0.5 + fadedP * 0.5);
    meshRef.current.scale.setScalar(baseScale * pulse);

    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uProgress.value = fadedP;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uProgress;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
            
            vec3 colorA = vec3(0.07, 0.19, 0.13);
            vec3 colorB = vec3(0.15, 0.36, 0.25);
            vec3 colorC = vec3(0.83, 0.69, 0.38);
            
            vec3 color = mix(colorA, colorB, smoothstep(0.0, 0.5, uProgress));
            color = mix(color, colorC, smoothstep(0.6, 1.0, uProgress) * 0.4);
            
            float alpha = fresnel * 0.07 * (0.2 + uProgress * 0.8);
            alpha += 0.008 * uProgress;
            
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}