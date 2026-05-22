# Pasta alla Palermitana — Interactive Recipe Website

**Date:** 2026-05-18
**Status:** Approved Design
**Author:** Samy

## Overview

A single-page, interactive cooking companion for **Pasta alla Palermitana** (pasta with sardines). Built as a static site using vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no backend. Designed for both beginners attempting the recipe for the first time and experienced cooks seeking an interactive, hands-free guide.

## Visual Identity

- **Style:** Warm Sicilian trattoria — terracotta, amber, ochre, rustic textures
- **Primary Font:** EB Garamond (titles, headings)
- **Secondary Font:** System sans-serif stack (instructions, body text)
- **Illustrations:** Hand-drawn style SVG icons and decorations

## Target Audience

- Home cooks trying pasta con le sarde for the first time
- Food enthusiasts looking for the definitive interactive recipe
- Self-use as a personal cooking assistant

## Page Architecture

Single-page, full-screen scroll-snap sections:

1. **Hero Section** — Entry point with "Inizia la ricetta" CTA
2. **Mise en Place Checklist** — Modal overlay (12 ingredients)
3. **Recipe Steps 1–12** — Scroll-snap sections, one per step
4. **Finale** — Sicilian audio + "MINCHIA BRAVO, ORA MANGIA!"
5. **Similar Recipe** — Card for related recipe

## File Structure

```
pasta-alla-palermitana/
├── index.html
├── css/
│   ├── style.css
│   └── fonts.css
├── js/
│   ├── app.js
│   ├── timer.js
│   ├── checklist.js
│   ├── color-matcher.js
│   ├── audio.js
│   └── gestures.js
├── assets/
│   ├── audio/
│   │   └── minchia-bravo.mp3
│   ├── images/
│   │   ├── hero-illustration.svg
│   │   ├── icons/
│   │   └── divider-finocchietto.svg
│   └── fonts/
│       └── EB-Garamond-*.woff2
```

## Features & Interactions

### 1. Hands-Free Mode (Gesture)

- Swipe left/right to navigate between recipe steps
- Large tap targets (min 60px) on all interactive elements
- No continuous voice control — voice is reserved for the finale only

### 2. Smart Timer (Step 10 — Cottura della pasta)

- Numeric input pre-filled with ~10 min (pasta box time)
- Auto-subtracts 2 minutes on timer start
- Progress ring (amber gradient) shows remaining time
- Large +/- buttons for hands-free adjustment

### 3. Water-Saving Notification

- Fires 30 seconds before timer ends
- Soft chime plays + slide-up card: "Salva un mestolo di acqua di cottura!"
- Large tap-to-dismiss button
- No voice prompt — reserved for finale

### 4. Visual Color Matcher (Step 7 — Muddica Atturrata)

- Inline gradient bar: white → golden amber → hazelnut → black
- Draggable thumb cursor with live label:
  - "Crudo"
  - "Iniziato"
  - "Perfetto!"
  - "Attenzione..."
  - "Bruciato!"
- Padella icon fills with selected color as reference

### 5. Mise en Place Checklist

- Full-screen modal overlay after "Inizia la ricetta"
- 12 ingredient cards with hand-drawn SVG icons
- Each tap: card animates to checked state + chime sound
- "Pronto — Inizia la cottura" button unlocks only when all 12 checked
- State persisted in localStorage for current session

### 6. Sicilian Audio Finale

- Auto-plays after last step (impiattamento)
- Voice: "MINCHIA BRAVO, ORA MANGIA!" in authentic Sicilian dialect
- Requires pre-recorded .mp3 audio file (not TTS — no synthesizer produces credible Sicilian accent)
- Audio file stored in `assets/audio/`

### 7. Similar Recipe Section

- Appears below the finale
- Divider: hand-drawn finocchietto illustration
- Title: "Potrebbe piacerti anche..."
- Single card with recipe name, short description, and "Vedi ricetta" placeholder link

## Data Flow

```
User action → JS event → Module handler → DOM update
                                        → localStorage (checklist state)
                                        → Audio playback (timer notification, finale)
                                        → CSS animation/transition
```

No backend, no API calls, no database. All state is ephemeral (in-memory) or persisted to localStorage (checklist completion).

## Error Handling

- Timer: cannot go below 0; displays warning if input is not a valid number
- Audio: gracefully degrades if audio file fails to load (silent fallback)
- Color matcher: clamped to gradient bounds
- Checklist: localStorage check on load; if corrupted, resets to unchecked
- Scroll-snap: CSS-only feature; unsupported browsers fall back to regular scroll

## Testing Approach

- Manual testing across Chrome, Safari, Firefox
- Test on mobile (touch/swipe) and desktop (click/keyboard)
- Timer accuracy verified with stopwatch
- Audio playback tested with various browsers (autoplay policies)
- Checklist persistence verified across page reload
- Color matcher tested for smooth drag behavior and correct labels

## Out of Scope (v1)

- No backend or database
- No PWA / service worker
- No camera-based features
- No user accounts or saved progress across sessions
- No multi-language support
- No e-commerce or ordering
