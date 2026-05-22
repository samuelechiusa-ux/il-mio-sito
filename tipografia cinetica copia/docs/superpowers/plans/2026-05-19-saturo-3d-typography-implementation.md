# SATURO 3D Typography — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing "Essenza 3D Generativa" page into a 3D typography art piece where the word "(SATURO)" replaces the icosahedron sphere, with 5 interactive sliders and cycling background.

**Architecture:** Single `index.html` with Three.js via CDN importmap. Add FontLoader + TextGeometry for 3D text. Reuse existing ShaderMaterial with adapted vertex shader. Add 5 HTML range sliders with custom CSS.

**Tech Stack:** Three.js (CDN), FontLoader, TextGeometry, custom GLSL shaders, HTML/CSS range sliders.

---

### File Structure

```
/Users/samuelechiusa/Desktop/Obsidian/Samuele Chiusa/tipografia cinetica copia/
└── index.html          ← single file, modify in-place
    ├── <head>           ← Three.js CDN importmap (aggiungere FontLoader + TextGeometry)
    ├── <script id="vertexShader" type="x-shader/x-vertex">  ← adattare per testo
    ├── <script id="fragmentShader" type="x-shader/x-fragment">  ← invariato
    ├── <div id="sliders"> ← nuovo: 5 slider HTML
    └── <script type="module">  ← orchestration, font loading, slider wiring
```

---

### Task 1: Font Loading Setup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add FontLoader and TextGeometry imports**

In the module script, add imports after `import * as THREE from 'three';`:

```javascript
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
```

- [ ] **Step 2: Load Jost Bold font**

After the `uniforms` declaration, add font loading:

```javascript
const fontLoader = new FontLoader();
let saturoFont = null;
fontLoader.load(
  'https://cdn.jsdelivr.net/npm/@compai/font-jost/data/typefaces/normal-700.json',
  (font) => {
    saturoFont = font;
    createTextMesh();
  },
  undefined,
  (err) => console.error('Font load error:', err)
);
```

- [ ] **Step 3: Create text mesh function**

Add after font loader:

```javascript
let mesh;

function createTextMesh() {
  const textGeo = new TextGeometry('(SATURO)', {
    font: saturoFont,
    size: 1,
    height: 0.5,
    curveSegments: 6,
    bevelThickness: 0.05,
    bevelSize: 0.02,
    bevelEnabled: true,
  });

  textGeo.computeBoundingBox();
  textGeo.center();

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  mesh = new THREE.Mesh(textGeo, material);
  scene.add(mesh);
}
```

- [ ] **Step 4: Remove old icosahedron mesh**

Find and remove:
```javascript
const geometry = new THREE.IcosahedronGeometry(2.0, 6);
const material = new THREE.ShaderMaterial({...});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

Replace with the font loading + `createTextMesh` call from steps above.

- [ ] **Step 5: Verify font loads**

Run: Open `index.html` in browser, check console for font load success and no errors.
Expected: Font loads, text "(SATURO)" appears centered.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: replace icosahedron with 3D text geometry (SATURO)"
```

---

### Task 2: Adapt Vertex Shader for Text Geometry

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Remove sphere-specific radius logic**

In the vertex shader (`<script id="vertexShader">`), replace the `void main()` block:

Old:
```glsl
void main() {
  vec3 pos = position;
  vec3 dir = normalize(pos);
  float currentRadius = uRadius;
  ...
  vec3 displacedPos = dir * (currentRadius + displacement);
  ...
}
```

New:
```glsl
void main() {
  vec3 pos = position;

  vec3 noiseInput = pos * 0.8 + vec3(uTime * 0.15 + uMouse.x * 0.3, uTime * 0.1 + uMouse.y * 0.2, uTime * 0.12);

  float n1 = fbm(noiseInput, 4);
  float n2 = snoise(pos * 0.4 + uTime * 0.08);
  float n3 = snoise(pos * 1.2 + uTime * 0.2);

  float combinedNoise = n1 * 0.6 + n2 * 0.25 + n3 * 0.15;
  vNoise = combinedNoise;

  float displacement = combinedNoise * uDisplacementAmp;
  vDisplacement = displacement;

  vec3 displacedPos = pos + normal * displacement;

  float twist = uMouse.x * 0.2 * combinedNoise;
  float cosT = cos(twist);
  float sinT = sin(twist);
  vec3 twistedPos = vec3(
    displacedPos.x * cosT - displacedPos.z * sinT,
    displacedPos.y,
    displacedPos.x * sinT + displacedPos.z * cosT
  );

  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(twistedPos, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(twistedPos, 1.0);
}
```

- [ ] **Step 2: Verify shader compiles**

Run: Open `index.html`, check browser console for shader compilation errors.
Expected: Text renders with noise displacement, no shader errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: adapt vertex shader for text geometry displacement"
```

---

### Task 3: Add Radius/Scale Cycle for Text

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace radius logic with text scale**

In the animation loop, change the radius target to control text scale. Replace:

```javascript
uniforms.uRadius.value = radiusTarget;
```

With text scaling that applies via a uniform. Add a new uniform `uScale` and use it in the animation loop:

```javascript
// Text scale follows same cycle as old radius
let scaleTarget;
if (phaseInCycle < ascentEnd) {
  scaleTarget = 1.0;
} else if (phaseInCycle < peakEnd) {
  const t = (phaseInCycle - ascentEnd) / (peakEnd - ascentEnd);
  scaleTarget = 1.0 + 3.0 * t;
} else if (phaseInCycle < descentEnd) {
  scaleTarget = 4.0;
} else {
  const t = (phaseInCycle - descentEnd) / (1.0 - descentEnd);
  scaleTarget = 4.0 - 3.0 * t;
}
```

Add this to the `mesh.scale` set in the animation loop (inside `createTextMesh` or accessible scope):

In the animation function, after the scale target calculation:
```javascript
if (mesh) {
  const baseScale = scaleTarget * (uniforms.uScaleMul ? uniforms.uScaleMul.value : 1.0);
  mesh.scale.set(baseScale, baseScale, baseScale);
}
```

Add the new uniform:
```javascript
uScaleMul: { value: 1.0 },
```

- [ ] **Step 2: Verify text scales correctly**

Run: Open `index.html`, watch the cycle. Text should start small (~1.0), expand to ~4.0x at peak, then contract back.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add text scale cycle matching original radius animation"
```

---

### Task 4: Background Cycling on Every Loop

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Remove backgroundArcComplete guard**

Find and remove the `backgroundArcComplete` flag and its condition:

Remove:
```javascript
let backgroundArcComplete = false;
```

And change the background update block from:
```javascript
if (!backgroundArcComplete) {
  const bgProgress = globalTime / CYCLE_DURATION;
  if (bgProgress < 0.375) { ... }
  ...
  if (bgProgress >= 1.0) {
    backgroundArcComplete = true;
    scene.background.copy(bgWhite);
  }
}
```

To:
```javascript
const bgProgress = (globalTime % CYCLE_DURATION) / CYCLE_DURATION;
if (bgProgress < 0.375) {
  const t = bgProgress / 0.375;
  scene.background.copy(bgWhite).lerp(bgYellow, t);
} else if (bgProgress < 0.75) {
  scene.background.copy(bgYellow);
} else {
  const t = (bgProgress - 0.75) / 0.25;
  scene.background.copy(bgYellow).lerp(bgWhite, t);
}
```

- [ ] **Step 2: Verify background cycles**

Run: Open `index.html`, observe multiple cycles. Background should go white→yellow→white on every 40s cycle, not just the first.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: make background cycle on every iteration"
```

---

### Task 5: HTML + CSS for 5 Sliders

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add slider container HTML**

Add after the canvas element, before the closing `</body>` tag:

```html
<div id="slider-bar">
  <div class="slider-group">
    <label>Scala</label>
    <input type="range" id="slider-scale" min="0.5" max="2.0" step="0.01" value="1.0">
    <span class="slider-value" id="val-scale">1.00</span>
  </div>
  <div class="slider-group">
    <label>Colore</label>
    <input type="range" id="slider-color" min="0" max="1" step="0.01" value="0">
    <span class="slider-value" id="val-color">auto</span>
  </div>
  <div class="slider-group">
    <label>Velocità</label>
    <input type="range" id="slider-speed" min="0.1" max="3.0" step="0.1" value="1.0">
    <span class="slider-value" id="val-speed">1.0</span>
  </div>
  <div class="slider-group">
    <label>Deformazione</label>
    <input type="range" id="slider-deform" min="0" max="2.0" step="0.01" value="0">
    <span class="slider-value" id="val-deform">auto</span>
  </div>
  <div class="slider-group">
    <label>Opacità</label>
    <input type="range" id="slider-opacity" min="0" max="1" step="0.01" value="0">
    <span class="slider-value" id="val-opacity">auto</span>
  </div>
</div>
```

- [ ] **Step 2: Add slider CSS**

Add to the `<style>` block in `<head>`:

```css
#slider-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 14px 24px 18px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 10;
  flex-wrap: wrap;
}

.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 90px;
}

.slider-group label {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #555;
}

.slider-group input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 90px;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  cursor: pointer;
}

.slider-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e34a00;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.15s;
}

.slider-group input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.slider-group input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e34a00;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.slider-value {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #888;
  min-width: 36px;
  text-align: center;
}
```

- [ ] **Step 3: Verify sliders render**

Run: Open `index.html`. Five sliders should appear in a glass-morphism bar at the bottom. Thumb should be orange/red, bar clean and minimal.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add 5 slider UI with glass-morphism design"
```

---

### Task 6: Wire Sliders to Shader Uniforms

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add slider reference variables and event listeners**

In the module script, add after the uniform definitions:

```javascript
// Slider state: null = follow cycle
let sliderColorVal = null;
let sliderDeformVal = null;
let sliderOpacityVal = null;

const sliderScale = document.getElementById('slider-scale');
const sliderColor = document.getElementById('slider-color');
const sliderSpeed = document.getElementById('slider-speed');
const sliderDeform = document.getElementById('slider-deform');
const sliderOpacity = document.getElementById('slider-opacity');

const valScale = document.getElementById('val-scale');
const valColor = document.getElementById('val-color');
const valSpeed = document.getElementById('val-speed');
const valDeform = document.getElementById('val-deform');
const valOpacity = document.getElementById('val-opacity');

sliderScale.addEventListener('input', () => {
  uniforms.uScaleMul.value = parseFloat(sliderScale.value);
  valScale.textContent = sliderScale.value;
});

sliderColor.addEventListener('input', () => {
  sliderColorVal = parseFloat(sliderColor.value);
  valColor.textContent = sliderColor.value;
});

sliderSpeed.addEventListener('input', () => {
  valSpeed.textContent = sliderSpeed.value;
});

sliderDeform.addEventListener('input', () => {
  sliderDeformVal = parseFloat(sliderDeform.value);
  valDeform.textContent = sliderDeform.value;
});

sliderOpacity.addEventListener('input', () => {
  sliderOpacityVal = parseFloat(sliderOpacity.value);
  valOpacity.textContent = sliderOpacity.value;
});
```

- [ ] **Step 2: Integrate slider values into animation loop**

In the animation function, after calculating `colorMix`, `dispAmp`, `opacity` from phase, add:

```javascript
// Apply slider overrides (null = follow cycle)
const effectiveColorMix = sliderColorVal !== null ? sliderColorVal : colorMix;
const effectiveDispAmp = sliderDeformVal !== null ? sliderDeformVal : (phaseInCycle < ascentEnd ? 0 : phaseInCycle < peakEnd ? ((phaseInCycle - ascentEnd) / (peakEnd - ascentEnd)) * 1.5 : phaseInCycle < descentEnd ? 1.5 : 1.5 * (1.0 - (phaseInCycle - descentEnd) / (1.0 - descentEnd)));
const effectiveOpacity = sliderOpacityVal !== null ? sliderOpacityVal : (0.3 + 0.55 * colorMix);

// Update slider display when following cycle
if (sliderColorVal === null) {
  sliderColor.value = colorMix;
  valColor.textContent = 'auto';
}
if (sliderDeformVal === null) {
  sliderDeform.value = effectiveDispAmp / 1.5;
  valDeform.textContent = 'auto';
}
if (sliderOpacityVal === null) {
  sliderOpacity.value = effectiveOpacity;
  valOpacity.textContent = 'auto';
}

uniforms.uDisplacementAmp.value = effectiveDispAmp;
uniforms.uOpacity.value = effectiveOpacity;
```

And modify the phase calculation to apply speed multiplier:
```javascript
const speedMul = parseFloat(sliderSpeed.value);
globalTime += delta * speedMul;
```

- [ ] **Step 3: Verify sliders control the scene**

Run: Open `index.html`, try each slider:
- Scale: text gets bigger/smaller
- Colore: overrides color mix  
- Velocità: cycle speeds up/slows down
- Deformazione: overrides noise amplitude
- Opacità: overrides transparency

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: wire 5 sliders to uniforms with cycle follow/override logic"
```

---

### Task 7: Particle System Adaptation

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Keep particle system but center on text origin**

The existing particle system works with the same uniforms/shader. Keep it as-is since particles follow the same color/opacity cycle. Just ensure particles are positioned at the text origin.

No code changes needed — particles already use the same `uniforms.uPhase` and color values. Verify they render inside/near the text volume.

- [ ] **Step 2: Verify particles are visible**

Run: Open `index.html`, look for particles around the text at peak phase.
Expected: Small glowing dots visible inside and around the text volume.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "chore: verify particle system works with text geometry"
```

---

### Task 8: Polish — Visual Tuning

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Tune text parameters**

- Adjust `TextGeometry` size, height, bevel for best look
- Tune `scaleTarget` min/max (currently 1.0 → 4.0)
- Tune displacement amplitude range
- Verify text remains centered and never clips off-screen at peak

- [ ] **Step 2: Performance check**

- Verify pixel ratio cap at 2 still works
- Check TextGeometry curveSegments (reduce to 4 if slow)
- Ensure `depthWrite: false` renders correctly
- Check for console warnings

- [ ] **Step 3: Final commit**

```bash
git add index.html
git commit -m "feat: final polish — visual tuning and performance optimization"
```

---

## Spec Coverage Check

| Spec Section | Task |
|-------------|------|
| Font Jost Bold via CDN | Task 1 |
| TextGeometry "(SATURO)" | Task 1 |
| Vertex shader adattato per testo | Task 2 |
| Text scale cycle | Task 3 |
| Sfondo ciclico su ogni iterazione | Task 4 |
| 5 slider HTML | Task 5 |
| Slider styling CSS professionale | Task 5 |
| Slider wiring to uniforms | Task 6 |
| Particelle interne | Task 7 |
| Polish visivo | Task 8 |
