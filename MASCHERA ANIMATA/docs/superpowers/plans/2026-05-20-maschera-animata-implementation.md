# Maschera Animata — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single self-contained `index.html` that renders the mask face and reacts to microphone input with two visual states.

**Architecture:** Single HTML file. Inline SVG contains both state's graphic elements (extended/retracted tongue, two drop shapes — mouth is the same in both states) — visibility toggled via CSS classes driven by JS audio analysis. Audio pipeline uses Web Audio API's `getUserMedia` + `AnalyserNode` + RMS threshold detection.

**Tech Stack:** HTML5, SVG, CSS3 (transitions + keyframes), Vanilla JS (Web Audio API)

---

### Task 1: HTML skeleton with inline SVG (photo + static elements)

**Files:**
- Create: `index.html`
- Source: `ANIMATA.svg` — extract `#FOTO`, `#OCCHIO`, `#PUPILLA` elements

- [ ] **Step 1: Create index.html with SVG and base photo**

Create `/Users/samuelechiusa/Desktop/Obsidian/Samuele Chiusa/MASCHERA ANIMATA/index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Maschera Animata</title>
</head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#1a1a2e">

<svg id="mask" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 735 1078.85" style="max-height:100vh;max-width:100%">
  <defs>
    <style>
      /* CSS will go here in Task 3 */
    </style>
  </defs>

  <!-- FOTO (from ANIMATA.svg / RIPOSO.svg — same in both) -->
  <g id="FOTO">
    <g id="FOTO1" data-name="FOTO">
      <image style="isolation:isolate" width="735" height="833" xlink:href="data:image/png;base64,..." />
      <rect y="824.39" width="735" height="8.61" fill="#fff"/>
      <!-- yellow decorations from ANIMATA.svg lines 36-37 -->
      <path fill="#c1c106" d="M662.44,534.88s74.32,28.74,45.57,64.5-75.02,6.31-67.3-15.42l.58-3.19,10.83-.32s9.24,29,27.09,20.08,25.17-14.66,21.99-20.71-13.06-16.57-13.06-16.57l-32.18-21.35s-4.53-7.98,6.5-7.01h-.02Z"/>
      <path fill="#c1c106" d="M99.13,541.09s-74.32,28.74-45.57,64.5c28.74,35.76,75.02,6.31,67.3-15.42l-.37-2.05h-11.56s-8.73,27.55-26.57,18.62c-17.84-8.92-25.17-14.66-21.99-20.71,3.19-6.05,13.06-16.57,13.06-16.57l32.18-21.35s4.53-7.98-6.5-7.01h.02Z"/>
    </g>
  </g>

  <!-- OCCHIO (same in both SVGs — from ANIMATA.svg lines 63-67) -->
  <g id="OCCHIO">
    <g id="OCCHI">
      <g>
        <path d="M59.52,327.15s45,13.32,84.95,33.98,44.08,36.27,40.41,42.7-22.96,43.16-23.88,44.54-5.97,11.02,13.32-2.76,12.4-29.39,33.52-37.65,26.17,22.5,60.15,6.89,42.7-28.01,51.89-41.78,27.55-16.07,27.55-19.74,2.3-16.53,11.02-26.17,64.74-29.85,69.34-34.9-61.99,11.02-76.22,10.56-26.17-4.59-29.39-14.23-16.99-12.4-16.99-12.4c0,0-15.61-5.97-4.13-34.44s8.72-51.43,12.4-57.4c3.67-5.97,3.21-13.32,3.21-13.32,0,0-20.2,26.17-22.5,38.57s-21.12,48.21-38.11,47.75-48.67,4.13-57.86-6.43c-9.18-10.56-39.95-50.05-41.78-55.1s-9.64-11.48-9.64-7.35,11.02,24.34,12.4,32.6,21.58,43.16,21.58,50.97-.46,20.2-8.27,22.04-16.53,16.99-22.5,23.88-7.35,16.53-39.49,10.56-50.97-1.38-50.97-1.38h0Z"/>
        <path fill="#fff" d="M166.97,340.03s41.28,23.59,71.84,24.12,54.68-10.72,66.48-12.06,16.62-10.99,26.27-15.81-14.47-10.19-24.66-26.27-51.47-12.33-71.3-13.94-61.12,33.77-68.62,43.96h0Z"/>
      </g>
    </g>
  </g>

  <!-- PUPILLA (same in both SVGs — from ANIMATA.svg lines 70-72) -->
  <g id="PUPILLA">
    <g id="PUPILLA1" data-name="PUPILLA">
      <ellipse cx="250.37" cy="330.1" rx="15.86" ry="19.44" fill="#fe0100" stroke="#000" stroke-miterlimit="10"/>
    </g>
  </g>
</svg>

<script>
// JS goes here (Tasks 4-5)
</script>
</body>
</html>
```

Extract the base64 string from `ANIMATA.svg` line 34 and paste it into `xlink:href`. Extract the yellow decoration paths and eye paths exactly as shown, preserving `fill` and `stroke` attributes.

- [ ] **Step 2: Verify SVG renders**

Open `index.html` in a browser. Expected: the mask photo shows with the star eye and pupil, no mouth/tongue/drop yet.

---

### Task 2: Add state-dependent SVG elements (mouth, tongue, drop)

**Files:**
- Modify: `index.html` — add both states' mouth, tongue, and drop paths inside `<svg>`

- [ ] **Step 1: Add mouth (same in both SVGs)**

Add inside `<svg>` after `#PUPILLA`:

```html
  <!-- BOCCA (same in both SVGs) -->
  <g id="BOCCA">
    <g id="BOCCA1" data-name="BOCCA">
      <g>
        <path d="M225.12,591.17s-94.41,93.49-27.61,174.8,241.24-6.43,254.37-25.53c13.13-19.1,8.57-93.12-46.24-149.25-54.81-56.14-180.52-.02-180.52-.02h0Z"/>
        <path fill="#fe0100" d="M450.62,731.99c-211.2,106.44-272.74-.22-272.74-.22,0,0,3.14,82.31,110.53,70.49,107.39-11.82,136.72-32.08,163.47-61.82l-1.26-8.45Z"/>
        <path fill="#fff" d="M243.46,629.77s7.59,38.45,2.98,43.72c-4.61,5.27-38.93,23.1-58.1,10.8l-2.85-9.2s44.55-42.13,57.97-45.32h0Z"/>
        <path fill="#fff" d="M264.47,617.02s-13.01,38.59-2.53,50.71c10.47,12.12,35.69,12.94,49.27,8.74,13.58-4.21,24.44-3.25,25.45-17.01,1.02-13.76-.86-41.5-.86-41.5,0,0-4.93-14.36-27.53-8.3s-43.81,7.35-43.81,7.35h0Z"/>
        <path fill="#fff" d="M349.27,619.56s-6.55,14.51-3.5,21.25-9.59,7.77,1.59,20.63,33.9,8.7,33.9,8.7c0,0,16.49,2.09,18.78-16.86s-41.48-40.91-50.77-33.72h0Z"/>
        <path fill="#fff" d="M413.46,645.46s-16.06,11.7-3.8,21.82,22.3,8.45,26.41,6.22-7.75-31.2-22.61-28.04h0Z"/>
        <path fill="#fe0100" d="M177.88,731.77s-37.19-73.8,22.85-143.67c30.1-35.03,44.64-52.19,85.79-46.22,0,0,28.41-20.03,64.31-6.83s87.38,64.61,95.64,88.25,16.43,37.94,21.42,69.14c4.99,31.2-16,47.99-16,47.99l-1.36-9.13s20.6-18.87,2.73-55.2-114.57-69.9-126.6-67.27-40.38,4.8-84.87,30.7c-44.49,25.9-49.98,38.99-58.43,60.33-8.99,22.72-5.47,31.9-5.47,31.9h-.01Z"/>
      </g>
    </g>
  </g>
```

- [ ] **Step 2: Add idle tongue (retracted, from RIPOSO.svg)**

```html
  <!-- LINGUA IDLE (retracted from RIPOSO.svg) -->
  <g id="lingua-idle" class="idle-elem">
    <g id="LINGUA">
      <g id="LINGUA1" data-name="LINGUA">
        <path d="M349.87,707.3s27.05,0,42.78,0,16.4,0,20.12.02c3.71.02-19.94.08-17.13.12,2.81.04-12.57.07-3.36.12,9.21.05-15.31.05-28.83.11-13.52.06-52.06.1-66.67.1-14.61,0-38.78.01-53.45-.04-14.67-.05-29.9-.11-32-.16s-3.53-.12-5.48-.13-5.46-.05,1.54-.06c7,0-12.97-.04-3.57-.06,20.5-.04,7.4-.01,61.73-.03,22.98,0,22.29.02,84.33.01h-.01Z" fill="#fe0100" stroke="#000" stroke-miterlimit="10"/>
      </g>
    </g>
  </g>
```

- [ ] **Step 3: Add active tongue (extended, from ANIMATA.svg)**

```html
  <!-- LINGUA ACTIVE (extended from ANIMATA.svg) -->
  <g id="lingua-active" class="active-elem">
    <g id="LINGUA">
      <g id="LINGUA1" data-name="LINGUA">
        <path d="M349.87,715.63s27.05-5.39,42.78-.71,16.4-3.21,20.12,12.21c3.71,15.43-19.94,56.33-17.13,82.29,2.81,25.95-12.57,47.69-3.36,82.41,9.21,34.72-15.31,36.32-28.83,76.51s-52.06,69.22-66.67,72.73c-14.61,3.52-38.78,10.19-53.45-25.79-14.67-35.98-29.9-77.84-32-115.13s-3.53-82.47-5.48-90.59-5.46-36.98,1.54-43.57-12.97-27.91-3.57-40.28c20.5-27,7.4-8.53,61.73-17.85,22.98-3.94,22.29,14.09,84.33,7.77h-.01Z" fill="#fe0100" stroke="#000" stroke-miterlimit="10"/>
      </g>
    </g>
  </g>
```

- [ ] **Step 4: Add idle drop (long tear shape from RIPOSO.svg)**

```html
  <!-- GOCCIA IDLE (tear shape from RIPOSO.svg) -->
  <g id="goccia-idle" class="idle-elem">
    <path fill="#08dcff" d="M177.88,748.57s-.23,81.56,4.27,137.48,22.35,53.49,23.14,30.29c1.2-35.2-27.42-167.77-27.42-167.77Z"/>
  </g>
```

- [ ] **Step 5: Add active drop (small droplet from ANIMATA.svg)**

```html
  <!-- GOCCIA ACTIVE (small droplet from ANIMATA.svg) -->
  <g id="goccia-active" class="active-elem">
    <path fill="#08dcff" d="M177.88,748.57s0,5.43,0,9.16.03,3.56.03,2.02c0-2.34-.04-11.18-.04-11.18Z"/>
  </g>
```

- [ ] **Step 6: Verify all elements render**

Open `index.html`. All elements render on top of each other (both tongues, both drops, plus mouth and eye). Don't worry about toggling yet — Task 3 adds the CSS to control visibility.

---

### Task 3: CSS transitions, keyframes, and state classes

**Files:**
- Modify: `index.html` — replace `<style>` block inside `<defs>` with full CSS

- [ ] **Step 1: Add CSS styles inside `<defs><style>`**

Replace the empty `<style>` block with:

```css
.idle-elem { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.active-elem { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

/* IDLE state: show idle elems, hide active elems */
.idle #lingua-idle { opacity: 1; }
.idle #lingua-active { opacity: 0; }
.idle #goccia-idle { opacity: 1; }
.idle #goccia-active { opacity: 0; }

/* ACTIVE state: show active elems, hide idle elems */
.active #lingua-idle { opacity: 0; }
.active #lingua-active { opacity: 1; }
.active #goccia-idle { opacity: 0; }
.active #goccia-active { opacity: 1; }

/* Drip animation for idle drop */
@keyframes drip {
  0% { transform: scaleY(1) translateY(0); }
  50% { transform: scaleY(1.3) translateY(8px); }
  100% { transform: scaleY(1) translateY(0); }
}
.idle #goccia-idle {
  transform-origin: top center;
  animation: drip 2s ease-in-out infinite;
}

/* Pupilla - static in idle, dynamic in active via JS */
#PUPILLA { transition: transform 0.05s; }

/* Lingua active - transform controlled by JS */
#lingua-active { transform-origin: top center; }
```

- [ ] **Step 2: Test CSS class toggling**

Open browser console and manually run:
```js
document.getElementById('mask').className = 'idle';
// then
document.getElementById('mask').className = 'active';
```

Expected: switching `className` toggles which mouth/tongue/drop is visible. The idle drop should animate with the drip effect.

---

### Task 4: Audio pipeline

**Files:**
- Modify: `index.html` — add JS code in the `<script>` block

- [ ] **Step 1: Add audio module variables and init function**

Add inside `<script>`:

```js
let audioCtx, analyser, dataArray;
let isListening = false;
const THRESHOLD = 0.05;
const HYSTERESIS_FRAMES = 8;
let silenceFrames = 0;

async function initAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.fftSize);
    isListening = true;
    document.getElementById('mask').className = 'idle';
    animate();
  } catch (err) {
    console.error('Microphone access denied:', err);
  }
}

function getRMS() {
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = (dataArray[i] / 128) - 1;
    sum += val * val;
  }
  return Math.sqrt(sum / dataArray.length);
}
```

- [ ] **Step 2: Add click-to-start listener**

```js
document.addEventListener('click', () => {
  if (!isListening) initAudio();
}, { once: true });
```

- [ ] **Step 3: Test audio prompt**

Open `index.html`, click anywhere. Expected: browser mic permission prompt appears. Check console for "Microphone access denied" if blocked, or `isListening = true` if allowed.

---

### Task 5: Animation loop and state management

**Files:**
- Modify: `index.html` — add `animate()` function and state logic

- [ ] **Step 1: Add state management and animate() function**

Add after `getRMS()`:

```js
let isActive = false;

function animate() {
  if (!isListening) return;
  requestAnimationFrame(animate);

  const rms = getRMS();
  const mask = document.getElementById('mask');
  const intensity = Math.min(rms / THRESHOLD, 1);

  if (rms > THRESHOLD) {
    silenceFrames = 0;
    if (!isActive) {
      isActive = true;
      mask.className = 'active';
    }
    // Active animations
    animateActive(intensity);
  } else {
    silenceFrames++;
    if (isActive && silenceFrames >= HYSTERESIS_FRAMES) {
      isActive = false;
      mask.className = 'idle';
      resetTransforms();
    }
  }
}
```

- [ ] **Step 2: Add active animation function (mask shake, pupil, tongue)**

```js
function animateActive(intensity) {
  const mask = document.getElementById('mask');
  const pupilla = document.querySelector('#PUPILLA ellipse');
  const lingua = document.getElementById('lingua-active');

  // Mask shake - vibration proportional to intensity
  const shakeX = (Math.random() - 0.5) * intensity * 6;
  const shakeY = (Math.random() - 0.5) * intensity * 6;
  mask.style.transform = `translate(${shakeX}px, ${shakeY}px)`;

  // Pupil: more tremor than scale
  const tremorX = (Math.random() - 0.5) * intensity * 4;
  const tremorY = (Math.random() - 0.5) * intensity * 4;
  const scale = 1 + intensity * 0.15;
  pupilla.setAttribute('transform', `translate(${tremorX}, ${tremorY}) scale(${scale})`);

  // Tongue: shoot down + wag laterally
  const extendY = intensity * 30;
  const wag = Math.sin(Date.now() / 100) * intensity * 8;
  lingua.style.transform = `translateY(${extendY}px) rotate(${wag}deg)`;
}
```

- [ ] **Step 3: Add reset function for smooth return to idle**

```js
function resetTransforms() {
  const mask = document.getElementById('mask');
  const pupilla = document.querySelector('#PUPILLA ellipse');
  const lingua = document.getElementById('lingua-active');

  mask.style.transform = '';
  pupilla.setAttribute('transform', '');
  lingua.style.transform = '';
}
```

- [ ] **Step 4: Test full interaction**

Open `index.html`. Click to enable mic. Make noise (clap, snap, speak). Expected:
- Silence → tongue hidden, drop dripping (idle state)
- Noise → tongue extends + wags, pupil trembles + scales, mask shakes, drop disappears
- Noise stops → smooth transition back to idle within ~300ms

---

### Task 6: Polish and edge cases

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add idle overlay text ("Click to activate mic")**

```html
<div id="overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);color:#fff;font-family:system-ui,sans-serif;font-size:1.5rem;cursor:pointer;z-index:10;transition:opacity 0.5s">
  Click to activate microphone
</div>
```

```js
// Add to click handler:
document.getElementById('overlay').style.opacity = '0';
setTimeout(() => document.getElementById('overlay').remove(), 500);
```

- [ ] **Step 2: Handle audio context resume (Chrome autoplay policy)**

```js
// Inside initAudio, after creating audioCtx:
if (audioCtx.state === 'suspended') await audioCtx.resume();
```

- [ ] **Step 3: Add touch support for mobile**

```js
document.addEventListener('touchstart', () => {
  if (!isListening) initAudio();
}, { once: true });
```

- [ ] **Step 4: Final test**

Open `index.html` in Chrome, Firefox, or Safari. Test:
1. Page loads → idle state with drip drop, overlay text
2. Click → overlay fades, mic prompt appears
3. Silence → everything calm
4. Loud noise → full active animation
5. Silence returns → smooth transition to idle

---

### Verification

1. Open `index.html` in a browser
2. Verify overlay appears with "Click to activate microphone"
3. Click → mic permission prompt
4. Allow mic → mask shows idle state
5. Make noise → active state engages
6. Verify smooth transition back to idle after noise stops
