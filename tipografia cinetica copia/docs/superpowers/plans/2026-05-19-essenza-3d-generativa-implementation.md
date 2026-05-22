# Essenza 3D Generativa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file generative art HTML page with a 3D translucent sphere that cyclically expands, morphs, shifts color from blue to saturated orange/red, and contains an internal gaseous particle cloud.

**Architecture:** Single `index.html` with Three.js via CDN importmap — custom vertex/fragment shaders for the main mesh, `PointsMaterial` for internal particles, and a JS orchestration loop managing the cyclic timeline (bluastro→ascesa→picco→discesa).

**Tech Stack:** Three.js (ES module build from CDN), WebGL2, custom GLSL shaders (Simplex noise, HSL interpolation, procedural porosity).

---

### File Structure

```
/Users/samuelechiusa/Desktop/Obsidian/Samuele Chiusa/tipografia cinetica/
└── index.html          ← single file, all code inline
	├── <head>           ← Three.js CDN importmap
	├── <script id="vertexShader" type="x-shader/x-vertex">
	├── <script id="fragmentShader" type="x-shader/x-fragment">
	└── <script type="importmap"> + <script type="module">  ← orchestration
```

---

### Task 1: HTML Scaffold + Three.js Scene Setup

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write HTML scaffold with Three.js importmap**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Essenza 3D Generativa</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #fff; }
    canvas { display: block; }
  </style>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
    }
  }
  </script>
</head>
<body>
  <!-- shaders go here (tasks 2, 3) -->
  <script type="module">
    import * as THREE from 'three';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    document.body.appendChild(renderer.domElement);

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cycle parameters
    const CYCLE_DURATION = 40; // seconds
    const PEAK_DURATION = 15;
    const ASCENT_DURATION = 10;
    const DESCENT_DURATION = 10;
    const REST_DURATION = 5;

    // Timers
    let globalTime = 0;
    let backgroundArcComplete = false;

    // Uniforms shared with shaders
    const uniforms = {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRadius: { value: 2.0 },
      uColor1: { value: new THREE.Color(0.95, 0.98, 1.0) },
      uColor2: { value: new THREE.Color(1.0, 0.3, 0.0) },
      uOpacity: { value: 0.3 },
      uDisplacementAmp: { value: 0.0 },
    };

    // Background colors
    const bgWhite = new THREE.Color(1, 1, 1);
    const bgYellow = new THREE.Color(1, 0.95, 0.75);

    // Animation loop placeholder — filled by subsequent tasks
    function animate() {
      requestAnimationFrame(animate);

      const delta = 1/60; // placeholder, will be proper delta
      globalTime += delta;
      uniforms.uTime.value = globalTime;

      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify scaffold works**

Run: Open `index.html` in browser (e.g., `open index.html` or `python3 -m http.server`)
Expected: White canvas, no errors in console.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: scaffold Three.js scene with cycle parameters"
```

---

### Task 2: Vertex Shader — Noise, Displacement, Morphing, Expansion

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Write vertex shader with Simplex noise (GLSL)**

Add inside `<body>` before the module script:

```html
<script id="vertexShader" type="x-shader/x-vertex">
  uniform float uTime;
  uniform float uPhase;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uDisplacementAmp;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;
  varying float vDisplacement;

  // Simplex noise 3D (Ashima Arts — MIT)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractal Brownian Motion
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 pos = position;
    float radius = length(pos);
    vec3 dir = normalize(pos);

    // Expansion based on phase
    float expandT = smoothstep(0.0, 0.375, uPhase);  // 0 → 1 during ascent
    float contractT = 1.0 - smoothstep(0.625, 1.0, uPhase); // 1 → 0 during descent
    float scaleFactor = 2.0 + 6.0 * min(expandT, 1.0) * min(contractT, 1.0);
    float currentRadius = uRadius * (scaleFactor / 2.0);

    // Noise-based displacement with mouse influence
    float mouseInfluenceX = uMouse.x * 0.3;
    float mouseInfluenceY = uMouse.y * 0.2;
    vec3 noiseInput = pos * 0.8 + vec3(uTime * 0.15 + mouseInfluenceX, uTime * 0.1 + mouseInfluenceY, uTime * 0.12);

    // Three noise patterns combined
    float n1 = fbm(noiseInput, 4);
    float n2 = snoise(pos * 0.4 + uTime * 0.08);
    float n3 = snoise(pos * 1.2 + uTime * 0.2);

    float combinedNoise = n1 * 0.6 + n2 * 0.25 + n3 * 0.15;
    vNoise = combinedNoise;

    // Displacement amplitude grows with phase
    float dispAmp = uDisplacementAmp * (0.0 + 1.5 * min(expandT, 1.0));
    float displacement = combinedNoise * dispAmp;
    vDisplacement = displacement;

    // Apply displacement along normal
    vec3 displacedPos = dir * (currentRadius + displacement);

    // Mouse-induced twist
    float twist = uMouse.x * 0.2 * combinedNoise;
    float cosT = cos(twist);
    float sinT = sin(twist);
    vec3 twistedPos = vec3(
      displacedPos.x * cosT - displacedPos.z * sinT,
      displacedPos.y,
      displacedPos.x * sinT + displacedPos.z * cosT
    );

    vNormal = normalize(normalMatrix * normal); // pass original normal, perturbed in fragment shader
    vPosition = twistedPos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(twistedPos, 1.0);
  }
</script>
```

- [ ] **Step 2: Create the mesh in JS using the vertex shader**

In the module script, after `uniforms`:

```javascript
const geometry = new THREE.IcosahedronGeometry(2.0, 6); // 6 subdivisions
const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.NormalBlending,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: vertex shader with simplex noise, displacement, morphing, expansion"
```

---

### Task 3: Fragment Shader — Color, Opacity, Porosity, Refraction

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Write fragment shader with HSL color interpolation and procedural porosity**

Add after the vertex shader script:

```html
<script id="fragmentShader" type="x-shader/x-fragment">
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;
  varying float vDisplacement;

  // Compute face normal from displaced position (fragment shader derivatives)
  vec3 calcNormal(vec3 pos) {
    return normalize(cross(dFdx(pos), dFdy(pos)));
  }

  // HSL conversion
  vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb = clamp(abs(mod(hsl.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    return hsl.z + hsl.y * (rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
  }

  vec3 rgb2hsl(vec3 rgb) {
    float maxC = max(max(rgb.r, rgb.g), rgb.b);
    float minC = min(min(rgb.r, rgb.g), rgb.b);
    float l = (maxC + minC) * 0.5;
    if (maxC == minC) return vec3(0.0, 0.0, l);
    float d = maxC - minC;
    float s = l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC);
    float h = 0.0;
    if (maxC == rgb.r) h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6.0 : 0.0);
    else if (maxC == rgb.g) h = (rgb.b - rgb.r) / d + 2.0;
    else h = (rgb.r - rgb.g) / d + 4.0;
    h /= 6.0;
    return vec3(h, s, l);
  }

  void main() {
    // Interpolate color based on phase
    float colorT = smoothstep(0.0, 0.375, uPhase);  // 0→1 during ascent
    float desatT = 1.0 - smoothstep(0.625, 1.0, uPhase); // 1→0 during descent
    float mixFactor = min(colorT, 1.0) * min(desatT, 1.0);

    vec3 baseColor = mix(uColor1, uColor2, mixFactor);

    // Add local color variation from noise
    float colorVar = vNoise * 0.15;
    vec3 hslBase = rgb2hsl(baseColor);
    hslBase.r += colorVar * 0.05; // slight hue shift
    hslBase.g = clamp(hslBase.g + colorVar * 0.2, 0.1, 1.0); // saturation variation
    vec3 finalColor = hsl2rgb(hslBase);

    // Refraction-like effect via normal from displaced surface + noise perturbation
    vec3 surfaceNormal = calcNormal(vPosition);
    vec3 perturbedNormal = normalize(surfaceNormal + vNoise * 0.3 * normalize(vec3(vNoise, vNoise * 0.5, vNoise * 0.3)));
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(dot(perturbedNormal, viewDir), 0.0);
    fresnel = pow(fresnel, 2.0);

    // Apply fresnel glow (brighter at edges)
    finalColor += fresnel * 0.3;

    // Procedural porosity — perforations based on noise pattern
    float porosityNoise = snoise(vPosition * 2.5 + uTime * 0.05);
    float porosityPattern = sin(vPosition.x * 8.0 + vPosition.y * 7.0 + vPosition.z * 5.0 + uTime * 0.1) * 0.5 + 0.5;
    float porosity = clamp(porosityNoise * 0.7 + porosityPattern * 0.3, 0.0, 1.0);

    // Opacity: base opacity modulated by porosity + fresnel
    float baseOpacity = uOpacity * (0.5 + 0.5 * mixFactor);
    float finalOpacity = baseOpacity * (0.6 + 0.4 * porosity);

    // Inner glow (brighter towards center of form)
    float innerGlow = 1.0 - abs(vNoise) * 0.3;
    finalColor += innerGlow * 0.1;

    gl_FragColor = vec4(finalColor, finalOpacity);
  }
</script>
```

- [ ] **Step 2: Verify shader compiles**

Run: Open `index.html`, check browser console for shader compilation errors.
Expected: Renders a transparent sphere with evolving color.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: fragment shader with HSL color interpolation, porosity, fresnel refraction"
```

---

### Task 4: Particle System — Internal Gas

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add particle system to JS module**

In the module script, after mesh creation:

```javascript
// Internal gas particles
const PARTICLE_COUNT = 3000;
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
const particleOpacities = new Float32Array(PARTICLE_COUNT);
const particlePhases = new Float32Array(PARTICLE_COUNT);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Random position inside sphere (cube->sphere projection for uniform distribution)
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = Math.cbrt(Math.random()) * 1.8; // cube root for uniform volume distribution
  particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = r * Math.cos(phi);
  particleOpacities[i] = 0.1 + Math.random() * 0.4;
  particlePhases[i] = Math.random() * Math.PI * 2;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(particleOpacities, 1));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.08,
  color: 0x88bbff,
  transparent: true,
  opacity: 0.3,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
```

- [ ] **Step 2: Add particle update logic in animation loop**

In the `animate()` function, after `uniforms.uTime.value = globalTime;`:

```javascript
// Update particles
const positions = particles.geometry.attributes.position.array;
const phase = uniforms.uPhase.value;

// Particle cloud expands/contracts with the sphere
const particleScale = 2.0 + 6.0 * min(smoothstep(0.0, 0.375, phase), 1.0) * min(1.0 - smoothstep(0.625, 1.0, phase), 1.0);
const particleRadius = 1.8 * (particleScale / 2.0);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const idx = i * 3;
  // Original normalized direction
  const px = particlePositions[idx];
  const py = particlePositions[idx + 1];
  const pz = particlePositions[idx + 2];
  const len = Math.sqrt(px * px + py * py + pz * pz);
  if (len > 0.001) {
    const normX = px / len;
    const normY = py / len;
    const normZ = pz / len;
    // Brownian motion
    const drift = Math.sin(globalTime * 0.5 + particlePhases[i]) * 0.05;
    positions[idx] = normX * (particleRadius * (0.3 + Math.random() * 0.7)) + drift;
    positions[idx + 1] = normY * (particleRadius * (0.3 + Math.random() * 0.7)) + drift * 0.7;
    positions[idx + 2] = normZ * (particleRadius * (0.3 + Math.random() * 0.7)) + drift * 0.5;
  }
}
particles.geometry.attributes.position.needsUpdate = true;

// Particle color follows the same evolution
const colorT = min(smoothstep(0.0, 0.375, phase), 1.0) * min(1.0 - smoothstep(0.625, 1.0, phase), 1.0);
const particleColor = new THREE.Color(0.95, 0.98, 1.0).lerp(new THREE.Color(1.0, 0.3, 0.0), colorT * 0.7);
particleMaterial.color.copy(particleColor);

// Particle opacity follows cycle
particleMaterial.opacity = 0.1 + 0.4 * colorT;
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: internal gas particle system with brownian motion"
```

---

### Task 5: Orchestration — Timeline, Cycle Management, Background

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Implement proper delta timing and phase calculation**

Replace `const delta = 1/60;` in `animate()` with:

```javascript
const delta = clock.getDelta();
globalTime += delta;
uniforms.uTime.value = globalTime;

// Calculate phase in cycle (0.0 → 1.0)
const phaseInCycle = (globalTime % CYCLE_DURATION) / CYCLE_DURATION;
uniforms.uPhase.value = phaseInCycle;

// Determine specific phase regions
const ascentEnd = REST_DURATION / CYCLE_DURATION; // ~0.125
const peakEnd = (REST_DURATION + ASCENT_DURATION) / CYCLE_DURATION; // ~0.375
const descentEnd = (REST_DURATION + ASCENT_DURATION + PEAK_DURATION) / CYCLE_DURATION; // ~0.75
```

Add clock at the top of module script:

```javascript
const clock = new THREE.Clock();
```

- [ ] **Step 2: Update uniforms based on phase**

After phase calculation:

```javascript
// Radius
let radiusTarget;
if (phaseInCycle < ascentEnd) {
  radiusTarget = 2.0; // bluastro phase — small sphere
} else if (phaseInCycle < peakEnd) {
  const t = (phaseInCycle - ascentEnd) / (peakEnd - ascentEnd);
  radiusTarget = 2.0 + 6.0 * t; // expand
} else if (phaseInCycle < descentEnd) {
  radiusTarget = 8.0; // peak — full size
} else {
  const t = (phaseInCycle - descentEnd) / (1.0 - descentEnd);
  radiusTarget = 8.0 - 6.0 * t; // contract back
}
uniforms.uRadius.value = radiusTarget;

// Displacement amplitude
if (phaseInCycle < ascentEnd) {
  uniforms.uDisplacementAmp.value = 0.0;
} else if (phaseInCycle < peakEnd) {
  const t = (phaseInCycle - ascentEnd) / (peakEnd - ascentEnd);
  uniforms.uDisplacementAmp.value = t * 1.5;
} else if (phaseInCycle < descentEnd) {
  uniforms.uDisplacementAmp.value = 1.5;
} else {
  const t = (phaseInCycle - descentEnd) / (1.0 - descentEnd);
  uniforms.uDisplacementAmp.value = 1.5 * (1.0 - t);
}

// Colors
const color1 = new THREE.Color(0.95, 0.98, 1.0); // white-blue
const color2 = new THREE.Color(1.0, 0.3, 0.0); // orange-red

let colorMix;
if (phaseInCycle < ascentEnd) {
  colorMix = 0.0;
} else if (phaseInCycle < peakEnd) {
  colorMix = (phaseInCycle - ascentEnd) / (peakEnd - ascentEnd);
} else if (phaseInCycle < descentEnd) {
  colorMix = 1.0;
} else {
  colorMix = 1.0 - (phaseInCycle - descentEnd) / (1.0 - descentEnd);
}
uniforms.uColor1.value.copy(color1);
uniforms.uColor2.value.copy(color2);

// Opacity
uniforms.uOpacity.value = 0.3 + 0.55 * colorMix;

// Background evolution (single arc — first cycle only)
if (!backgroundArcComplete) {
  const bgProgress = globalTime / CYCLE_DURATION; // 0→1 over first cycle
  if (bgProgress < 0.375) {
    const t = bgProgress / 0.375;
    scene.background.copy(bgWhite).lerp(bgYellow, t);
  } else if (bgProgress < 0.75) {
    scene.background.copy(bgYellow);
  } else {
    const t = (bgProgress - 0.75) / 0.25;
    scene.background.copy(bgYellow).lerp(bgWhite, t);
  }
  if (bgProgress >= 1.0) {
    backgroundArcComplete = true;
    scene.background.copy(bgWhite);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: cycle timeline orchestration with phase-based uniforms and background"
```

---

### Task 6: Light Interaction — Mouse and Touch

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add mouse/touch input handlers**

In the module script, after the resize handler:

```javascript
// Mouse interaction
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let clickImpulse = 0;

window.addEventListener('mousemove', (event) => {
  mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
  clickImpulse = 1.0;
});

window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

window.addEventListener('touchstart', () => {
  clickImpulse = 1.0;
});
```

- [ ] **Step 2: Apply mouse smoothing and impulse to uniforms**

In the animation loop, after uniforms update:

```javascript
// Smooth mouse following
mouse.x += (mouse.targetX - mouse.x) * 0.05;
mouse.y += (mouse.targetY - mouse.y) * 0.05;
uniforms.uMouse.value.set(mouse.x, mouse.y + clickImpulse * 0.5);

// Decay click impulse
clickImpulse *= 0.95;
if (clickImpulse < 0.01) clickImpulse = 0;
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: mouse and touch interaction with smooth decay"
```

---

### Task 7: Polish — Quality Pass

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Verify and tune visual parameters**

- Open `index.html` in browser
- Confirm the cycle visually: bluastro (small, nearly spherical, white-blue, low opacity) → ascent (expanding, deforming, warming up) → peak (full size, deformed, orange-red, high opacity, 15s) → descent (contracting, reverting color)
- Confirm background white→yellow→white during first cycle only
- Confirm particles are visible inside the volume and follow color evolution
- Confirm mouse interaction subtly influences deformation
- Adjust `CYCLE_DURATION`, `PEAK_DURATION`, `ASCENT_DURATION`, `DESCENT_DURATION`, `REST_DURATION` if timing feels off
- Adjust noise amplitudes, color mixing curves, opacity ranges, particle count/size for visual quality

- [ ] **Step 2: Performance optimization**

- Verify pixel ratio cap at 2
- Reduce geometry subdivisions to 5 if needed on lower-end devices
- Verify depthWrite: false + transparent material renders correctly
- Check for any console warnings or errors

- [ ] **Step 3: Final commit**

```bash
git add index.html
git commit -m "feat: final polish — visual tuning and performance optimization"
```

---

## Spec Coverage Check

| Spec Section | Task |
|-------------|------|
| Stack: single HTML + Three.js CDN | Task 1 |
| Geometry: Icosahedron subdivisions | Task 2 (vertex shader + JS mesh) |
| Displacement: Simplex noise 3D | Task 2 (vertex shader) |
| Expansion/contraction | Task 2 + Task 5 |
| Color: bluastro ↔ arancio/rosso | Task 3 (fragment shader) + Task 5 (orchestration) |
| Porosity: micro-perforazioni | Task 3 (fragment shader) |
| Gas interno: particelle | Task 4 |
| Sfondo: bianco→giallo→bianco | Task 5 |
| Timeline cycle sync | Task 5 |
| Interazione: mouse/touch | Task 6 |
| Click impulse | Task 6 |
| Irreversibilità: tempo monotono | Task 5 (globalTime, backgroundArcComplete) |
