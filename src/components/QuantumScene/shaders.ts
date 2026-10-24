export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntensity;
  uniform vec2 uMouse;
  
  attribute vec3 aTarget;
  attribute float aPhase;
  attribute float aSize;
  attribute float aDelay;
  
  varying float vAlpha;
  varying float vPhase;
  varying vec3 vColor;
  
  // Simplex noise 3D
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a1.xy,h.y);
    vec3 p2 = vec3(a1.zw,h.z); // fixed: was a0.zw
    vec3 p3 = vec3(a0.zw,h.w); // fixed: was a1.zw
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    float t = uTime * 0.15;
    float delayedProgress = max(0.0, (uProgress - aDelay) / (1.0 - aDelay));
    delayedProgress = smoothstep(0.0, 1.0, delayedProgress);
    
    // Noise-based chaotic displacement
    float noise1 = snoise(position * 0.5 + t);
    float noise2 = snoise(position * 0.8 + t * 1.3 + 100.0);
    float noise3 = snoise(position * 0.3 + t * 0.7 + 200.0);
    
    vec3 chaoticPos = position + vec3(noise1, noise2, noise3) * 2.0 * uIntensity;
    
    // Orbital motion for mid-states
    float angle = aPhase * 6.2831 + t * 0.5;
    float orbitRadius = 1.5 + aPhase * 1.0;
    vec3 orbitOffset = vec3(cos(angle), sin(angle * 0.7) * 0.5, sin(angle)) * orbitRadius;
    vec3 orbitedPos = mix(chaoticPos, chaoticPos + orbitOffset * 0.3, smoothstep(0.2, 0.5, delayedProgress));
    
    // Mouse influence
    vec2 mouseInfluence = uMouse * 0.3 * (1.0 - delayedProgress * 0.5);
    orbitedPos.x += mouseInfluence.x;
    orbitedPos.y += mouseInfluence.y;
    
    // Final position: chaotic → ordered
    vec3 finalPos = mix(orbitedPos, aTarget, delayedProgress);
    
    // Subtle breathing motion even when ordered
    float breathe = sin(t * 2.0 + aPhase * 6.28) * 0.05 * (0.3 + delayedProgress * 0.7);
    finalPos += normalize(aTarget + 0.001) * breathe;
    
    // Alpha: particles fade in, then stay visible
    float fadeIn = smoothstep(0.0, 0.3, uProgress);
    // Converged particles overlap heavily under additive blending, so they thin out as they order
    float orderAlpha = mix(0.45, 0.12, delayedProgress);
    vAlpha = fadeIn * orderAlpha * uIntensity;
    
    // Color: muted → luminous
    vPhase = delayedProgress;
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    float sizeAttenuation = 300.0 / -mvPosition.z;
    gl_PointSize = aSize * sizeAttenuation * (0.75 - delayedProgress * 0.2);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform float uProgress;
  varying float vAlpha;
  varying float vPhase;
  
  void main() {
    // Soft circle
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    
    if (alpha < 0.01) discard;
    
    // Color interpolation: forest → emerald → gold glow
    vec3 colorA = vec3(0.07, 0.19, 0.13); // forest
    vec3 colorB = vec3(0.15, 0.36, 0.25); // emerald
    vec3 colorC = vec3(0.83, 0.69, 0.38); // gold
    
    vec3 color = mix(colorA, colorB, smoothstep(0.0, 0.6, vPhase));
    color = mix(color, colorC, smoothstep(0.6, 1.0, vPhase) * 0.35);
    
    // Luminous bloom when ordered
    float glow = smoothstep(0.5, 1.0, vPhase) * 0.12;
    color += glow * vec3(1.0, 0.85, 0.55);
    
    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;