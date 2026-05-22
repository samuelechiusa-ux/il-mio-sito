# Maschera Animata — Microphone-Reactive Interactive Graphic

## Overview

A real-time sound-responsive interactive web graphic that transitions between two visual states (IDLE / ACTIVE) based on live microphone amplitude. Built as a single HTML page with inline SVG, vanilla JS, and CSS transitions.

## Source Files

- `ANIMATA.svg` — "animated" mask state (mouth open, tongue out, droplet, star eye)
- `RIPOSO.svg` — "rest" mask state (mouth closed, no tongue, different droplet)

## Output File

- `index.html` — self-contained page combining both SVG states into one unified SVG, plus audio pipeline and animation logic

## Architecture

### File Structure

```
MASCHERA ANIMATA/
├── index.html              # Single-page application
├── ANIMATA.svg             # Source reference
├── RIPOSO.svg              # Source reference
├── docs/superpowers/specs/
│   └── 2026-05-20-maschera-animata-mic-reactive-design.md
```

### Rendering Approach

HTML + SVG inline. SVG paths extracted from the two source SVGs and unified into a single inline SVG in `index.html`. Animations via CSS transitions and JS-driven class/transform changes.

## States

### STATE 1: IDLE / REST (silence, below threshold)

| Element | Behavior |
|---------|----------|
| Mask (whole) | Static, no movement |
| Pupil (`#pupilla`) | Completely static. No animation. |
| Tongue (`#lingua`) | Hidden. `opacity: 0; transform: scaleY(0)` |
| Blue Drop (`#goccia`) | Visible. Subtle "drip" animation — cyclically stretches and retracts downward (never detaches). CSS animation with `ease-in-out`. |

### STATE 2: ACTIVE / ALTERED (noise detected)

| Element | Behavior |
|---------|----------|
| Mask (whole) | Shakes/vibrates dynamically, intensity mapped to live audio amplitude |
| Pupil (`#pupilla`) | Scales with volume + rapid tremor (more tremor than scaling) |
| Tongue (`#lingua`) | Visible. Shoots downward + wags laterally, mapped to audio intensity |
| Blue Drop (`#goccia`) | Instantly hidden. `opacity: 0; pointer-events: none` |

### Transition

- **IDLE → ACTIVE:** Instant class switch to `.active` on SVG
- **ACTIVE → IDLE:** Smooth return via CSS transition `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`. Elements lerp back to idle positions. Blue drop fades back in.

## Audio Pipeline

1. **Trigger:** First user click/tap on the page calls `navigator.mediaDevices.getUserMedia({ audio: true })`
2. **Context:** `AudioContext` + `AnalyserNode` (FFT size 256)
3. **Loop:** Each `requestAnimationFrame`:
   - Read `getByteTimeDomainData()`
   - Compute RMS (root mean square) of current buffer
   - Compare against fixed threshold
    - Hysteresis: require `rms < threshold` for 8 consecutive frames (~130ms at 60fps) before switching back to IDLE (prevents flicker)
4. **Normalization:** Raw RMS → normalized 0..1 value driving animation intensity

## Element IDs (SVG)

- `#maschera` — root `<g>` for full-mask vibration
- `#pupilla` — pupil ellipse inside star eye
- `#lingua` — tongue path
- `#goccia` — blue droplet path

## CSS

- Transitions: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` on animated elements
- `.idle #goccia`: `animation: drip 2s ease-in-out infinite` — CSS `@keyframes drip` cycles `transform: scaleY(1) translateY(0)` → `scaleY(1.3) translateY(8px)` → back
- `.active #goccia`: `opacity: 0; transition: opacity 0.1s`
- Pupil tremor: JS-driven `transform` via `requestAnimationFrame`
- Tongue extension/wag: JS-driven `transform: translateY()` + `rotate()`

## Dependencies

None. Zero external libraries. Zero build tools.

## Browser Support

Modern browsers with Web Audio API and `getUserMedia` support.

## Success Criteria

- Page loads, shows idle mask with dripping drop
- Click/tap anywhere → mic permission prompt appears
- Silence → pupil static, tongue hidden, drop dripping
- Noise/clap/snap → mask shakes, pupil trembles+scales, tongue shoots out, drop hides
- Noise stops → smooth transition back to IDLE within ~300ms
- No flicker between states (hysteresis)
