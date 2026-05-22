# Pasta alla Palermitana — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive, single-page cooking companion for Pasta alla Palermitana using vanilla HTML/CSS/JS.

**Architecture:** Single scrolling page with full-screen scroll-snap sections. Each JS module is a standalone function group loaded by a central app.js. No framework, no build step, no backend. All state lives in memory or localStorage.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, scroll-snap, flexbox/grid), Vanilla ES6 JavaScript. Google Fonts for EB Garamond. No dependencies.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `/codebase/index.html`
- Create: `/codebase/css/style.css`
- Create: `/codebase/css/fonts.css`
- Create: `/codebase/js/app.js`
- Create: `/codebase/js/timer.js`
- Create: `/codebase/js/checklist.js`
- Create: `/codebase/js/color-matcher.js`
- Create: `/codebase/js/audio.js`
- Create: `/codebase/js/gestures.js`
- Create: `/codebase/assets/audio/.gitkeep`
- Create: `/codebase/assets/images/.gitkeep`
- Create: `/codebase/assets/fonts/.gitkeep`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "codebase/css" "codebase/js" "codebase/assets/audio" "codebase/assets/images" "codebase/assets/fonts"
touch "codebase/assets/audio/.gitkeep" "codebase/assets/images/.gitkeep" "codebase/assets/fonts/.gitkeep"
```

- [ ] **Step 2: Create empty CSS and JS files**

```bash
touch codebase/css/style.css codebase/css/fonts.css
touch codebase/js/app.js codebase/js/timer.js codebase/js/checklist.js codebase/js/color-matcher.js codebase/js/audio.js codebase/js/gestures.js
```

- [ ] **Step 3: Create index.html with DOCTYPE, lang, viewport meta, and all file references**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pasta alla Palermitana</title>
  <link rel="stylesheet" href="css/fonts.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app"></div>
  <script src="js/audio.js"></script>
  <script src="js/timer.js"></script>
  <script src="js/checklist.js"></script>
  <script src="js/color-matcher.js"></script>
  <script src="js/gestures.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create fonts.css with EB Garamond import**

```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
```

---

### Task 2: CSS Foundation — Variables, Reset, Base Styles

**Files:**
- Modify: `codebase/css/style.css`

- [ ] **Step 1: Add CSS custom properties and reset**

```css
:root {
  --terracotta: #C1694F;
  --terracotta-dark: #8B3A2A;
  --terracotta-light: #E8A88C;
  --amber: #E6A817;
  --amber-light: #F4D03F;
  --ochre: #CC7722;
  --cream: #FFF8EE;
  --white: #FFFFFF;
  --charcoal: #2C2C2C;
  --warm-gray: #6B5B4F;
  --success-green: #4CAF50;
  --danger-red: #D32F2F;

  --font-heading: 'EB Garamond', 'Georgia', serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  --spacing-xl: 64px;

  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-full: 50%;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  color: var(--charcoal);
  background: var(--cream);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: Add scroll-snap container styles and section defaults**

```css
#app {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

.section-heading {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--terracotta-dark);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.section-subtitle {
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--warm-gray);
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
}
```

---

### Task 3: Hero Section

**Files:**
- Modify: `codebase/index.html` (add hero section inside #app)
- Modify: `codebase/css/style.css` (hero-specific styles)

- [ ] **Step 1: Add hero HTML to index.html**

```html
<div id="app">

  <!-- HERO -->
  <section class="section hero" id="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <h1 class="hero-title">Pasta alla Palermitana</h1>
      <p class="hero-author">di Samy</p>
      <div class="hero-illustration">
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="80" r="60" fill="var(--amber)" opacity="0.3"/>
          <path d="M60 80 Q80 50 100 80 Q120 50 140 80" stroke="var(--terracotta)" stroke-width="3" fill="none"/>
          <path d="M40 100 Q80 70 100 90 Q120 70 160 100" stroke="var(--ochre)" stroke-width="2" fill="none"/>
          <circle cx="70" cy="70" r="4" fill="var(--amber)"/>
          <circle cx="130" cy="70" r="4" fill="var(--amber)"/>
        </svg>
      </div>
      <button class="btn-primary" id="start-recipe">Inizia la ricetta</button>
    </div>
    <div class="scroll-hint">
      <span>Tocca per iniziare</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  </section>

</div>
```

- [ ] **Step 2: Add hero CSS styles**

```css
.hero {
  background: linear-gradient(135deg, var(--terracotta-dark) 0%, var(--terracotta) 100%);
  color: var(--white);
  text-align: center;
  position: relative;
}

.hero-content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 4rem;
  font-weight: 700;
  color: var(--amber);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  line-height: 1.1;
}

.hero-author {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-style: italic;
  color: var(--amber-light);
  opacity: 0.9;
}

.hero-illustration svg {
  width: 160px;
  height: 130px;
}

.btn-primary {
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 48px;
  border: none;
  border-radius: 50px;
  background: var(--amber);
  color: var(--charcoal);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 220px;
  min-height: 60px;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(230, 168, 23, 0.4);
}

.btn-primary:active {
  transform: scale(0.97);
}

.scroll-hint {
  position: absolute;
  bottom: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--amber-light);
  opacity: 0.7;
  font-size: 0.85rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
```

---

### Task 4: Mise en Place Checklist Overlay

**Files:**
- Modify: `codebase/index.html` (add checklist HTML after hero)
- Modify: `codebase/css/style.css` (checklist styles)
- Modify: `codebase/js/checklist.js` (full implementation)
- Create: `codebase/assets/images/icons/` (placeholder SVGs for ingredients)

- [ ] **Step 1: Add checklist HTML (modal overlay)**

```html
  <!-- CHECKLIST OVERLAY -->
  <div class="checklist-overlay" id="checklist-overlay">
    <div class="checklist-modal">
      <h2 class="checklist-title">Mise en Place</h2>
      <p class="checklist-subtitle">Controlla di avere tutto prima di accendere il fuoco</p>
      <div class="checklist-grid" id="checklist-grid">
        <div class="checklist-item" data-ingredient="bucatini">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><rect x="10" y="5" width="20" height="30" rx="3" fill="var(--amber)" opacity="0.4"/><line x1="18" y1="10" x2="18" y2="30" stroke="var(--ochre)" stroke-width="2"/><line x1="22" y1="10" x2="22" y2="30" stroke="var(--ochre)" stroke-width="2"/></svg>
          </div>
          <span class="checklist-label">Bucatini</span>
        </div>
        <div class="checklist-item" data-ingredient="sarde">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><ellipse cx="20" cy="20" rx="12" ry="6" fill="var(--terracotta-light)" opacity="0.5"/><circle cx="14" cy="18" r="1.5" fill="var(--charcoal)"/></svg>
          </div>
          <span class="checklist-label">Sarde</span>
        </div>
        <div class="checklist-item" data-ingredient="cipolla">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><circle cx="20" cy="22" r="10" fill="var(--amber)" opacity="0.4"/><path d="M20 8 Q24 16 20 22 Q16 16 20 8" fill="var(--ochre)" opacity="0.5"/></svg>
          </div>
          <span class="checklist-label">Cipolla dorata</span>
        </div>
        <div class="checklist-item" data-ingredient="finocchietto">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><path d="M20 36 Q12 26 14 16 Q16 10 20 8 Q24 10 26 16 Q28 26 20 36" fill="var(--success-green)" opacity="0.3"/><line x1="20" y1="8" x2="20" y2="36" stroke="var(--success-green)" stroke-width="1.5"/></svg>
          </div>
          <span class="checklist-label">Finocchietto</span>
        </div>
        <div class="checklist-item" data-ingredient="acciughe">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><path d="M10 20 Q18 14 30 16 L28 24 Q18 26 10 20" fill="var(--warm-gray)" opacity="0.4"/></svg>
          </div>
          <span class="checklist-label">Acciughe</span>
        </div>
        <div class="checklist-item" data-ingredient="uvetta">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><circle cx="14" cy="16" r="4" fill="var(--terracotta)" opacity="0.5"/><circle cx="24" cy="18" r="3.5" fill="var(--terracotta)" opacity="0.4"/><circle cx="19" cy="26" r="4" fill="var(--terracotta)" opacity="0.45"/></svg>
          </div>
          <span class="checklist-label">Uvetta passa</span>
        </div>
        <div class="checklist-item" data-ingredient="pinoli">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><ellipse cx="14" cy="16" rx="4" ry="6" fill="var(--amber)" opacity="0.5" transform="rotate(-20 14 16)"/><ellipse cx="26" cy="18" rx="4" ry="6" fill="var(--amber)" opacity="0.5" transform="rotate(15 26 18)"/><ellipse cx="20" cy="26" rx="4" ry="6" fill="var(--amber)" opacity="0.45" transform="rotate(-5 20 26)"/></svg>
          </div>
          <span class="checklist-label">Pinoli</span>
        </div>
        <div class="checklist-item" data-ingredient="pangrattato">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><rect x="8" y="14" width="24" height="14" rx="2" fill="var(--amber-light)" opacity="0.5"/><circle cx="14" cy="20" r="1.5" fill="var(--ochre)"/><circle cx="20" cy="22" r="1" fill="var(--ochre)"/><circle cx="26" cy="19" r="1.5" fill="var(--ochre)"/></svg>
          </div>
          <span class="checklist-label">Pangrattato</span>
        </div>
        <div class="checklist-item" data-ingredient="olio">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><path d="M20 6 Q22 10 24 16 Q26 24 22 30 Q20 34 18 30 Q14 24 16 16 Q18 10 20 6" fill="var(--amber)" opacity="0.4"/></svg>
          </div>
          <span class="checklist-label">Olio EVO</span>
        </div>
        <div class="checklist-item" data-ingredient="zafferano">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><line x1="20" y1="10" x2="20" y2="30" stroke="var(--amber)" stroke-width="2"/><path d="M14 14 Q20 8 26 14" fill="none" stroke="var(--amber)" stroke-width="1.5"/><path d="M12 20 Q20 14 28 20" fill="none" stroke="var(--amber)" stroke-width="1.5"/><circle cx="20" cy="32" r="3" fill="var(--danger-red)" opacity="0.6"/></svg>
          </div>
          <span class="checklist-label">Zafferano</span>
        </div>
        <div class="checklist-item" data-ingredient="sale">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><rect x="14" y="8" width="12" height="24" rx="2" fill="var(--warm-gray)" opacity="0.3"/><circle cx="17" cy="14" r="1" fill="var(--charcoal)"/><circle cx="23" cy="18" r="1" fill="var(--charcoal)"/><circle cx="18" cy="22" r="1" fill="var(--charcoal)"/></svg>
          </div>
          <span class="checklist-label">Sale grosso</span>
        </div>
        <div class="checklist-item" data-ingredient="pepe">
          <div class="checklist-icon">
            <svg viewBox="0 0 40 40" width="32" height="32"><circle cx="20" cy="20" r="8" fill="var(--charcoal)" opacity="0.3"/><circle cx="16" cy="16" r="2.5" fill="var(--charcoal)" opacity="0.5"/><circle cx="24" cy="22" r="2" fill="var(--charcoal)" opacity="0.4"/><circle cx="18" cy="26" r="1.5" fill="var(--charcoal)" opacity="0.35"/></svg>
          </div>
          <span class="checklist-label">Pepe nero</span>
        </div>
      </div>
      <button class="btn-primary" id="checklist-confirm" disabled>Pronto — Inizia la cottura</button>
    </div>
  </div>
```

- [ ] **Step 2: Add checklist CSS**

```css
.checklist-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--spacing-md);
}

.checklist-overlay.active {
  display: flex;
}

.checklist-modal {
  background: var(--cream);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  text-align: center;
}

.checklist-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--terracotta-dark);
  margin-bottom: var(--spacing-sm);
}

.checklist-subtitle {
  font-family: var(--font-body);
  color: var(--warm-gray);
  margin-bottom: var(--spacing-lg);
}

.checklist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.checklist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 2px solid var(--terracotta-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.checklist-item:hover {
  border-color: var(--terracotta);
  background: rgba(193, 105, 79, 0.05);
}

.checklist-item.checked {
  border-color: var(--success-green);
  background: rgba(76, 175, 80, 0.08);
  opacity: 0.7;
}

.checklist-item.checked .checklist-label {
  text-decoration: line-through;
  color: var(--success-green);
}

.checklist-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checklist-label {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--charcoal);
}

.checklist-modal .btn-primary {
  margin-top: var(--spacing-sm);
}

.checklist-modal .btn-primary:disabled {
  background: var(--warm-gray);
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

- [ ] **Step 3: Implement checklist.js**

```javascript
const Checklist = (() => {
  const STORAGE_KEY = 'pasta-checklist';

  function init() {
    const overlay = document.getElementById('checklist-overlay');
    const grid = document.getElementById('checklist-grid');
    const confirmBtn = document.getElementById('checklist-confirm');
    const startBtn = document.getElementById('start-recipe');

    startBtn.addEventListener('click', () => {
      const saved = loadState();
      overlay.classList.add('active');
      if (saved) {
        saved.forEach(id => {
          const item = grid.querySelector(`[data-ingredient="${id}"]`);
          if (item) item.classList.add('checked');
        });
      }
      updateConfirmBtn();
    });

    grid.addEventListener('click', (e) => {
      const item = e.target.closest('.checklist-item');
      if (!item) return;
      item.classList.toggle('checked');
      saveState(getCheckedIds());
      playChime();
      updateConfirmBtn();
    });

    confirmBtn.addEventListener('click', () => {
      const checked = getCheckedIds();
      if (checked.length < 12) return;
      overlay.classList.remove('active');
      clearState();
    });
  }

  function getCheckedIds() {
    return [...document.querySelectorAll('.checklist-item.checked')]
      .map(el => el.dataset.ingredient);
  }

  function updateConfirmBtn() {
    const btn = document.getElementById('checklist-confirm');
    btn.disabled = getCheckedIds().length < 12;
  }

  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (_) {}
  }

  function saveState(ids) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch (_) {}
  }

  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (_) { return null; }
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  return { init };
})();
```

---

### Task 5: Recipe Steps — All 12 Steps HTML + CSS

**Files:**
- Modify: `codebase/index.html` (add all 12 recipe step sections)
- Modify: `codebase/css/style.css` (step section styles)

- [ ] **Step 1: Add recipe steps HTML (insert after checklist overlay, before closing #app)**

```html
  <!-- STEP 1 -->
  <section class="section step" data-step="1" id="step-1">
    <span class="step-number">1</span>
    <h2 class="section-heading">Ammollo dell'uvetta</h2>
    <p class="section-subtitle">Metti l'uvetta passa in una tazza di acqua tiepida e lasciala riposare.</p>
  </section>

  <!-- STEP 2 -->
  <section class="section step" data-step="2" id="step-2">
    <span class="step-number">2</span>
    <h2 class="section-heading">Triturazione della cipolla</h2>
    <p class="section-subtitle">Pela la cipolla dorata, tagliala a metà e sminuzzala finemente al coltello.</p>
  </section>

  <!-- STEP 3 -->
  <section class="section step" data-step="3" id="step-3">
    <span class="step-number">3</span>
    <h2 class="section-heading">Pulizia del finocchietto</h2>
    <p class="section-subtitle">Elimina i gambi più spessi e legnosi tenendo solo i ciuffetti verdi. Lava accuratamente sotto acqua fredda.</p>
  </section>

  <!-- STEP 4 -->
  <section class="section step" data-step="4" id="step-4">
    <span class="step-number">4</span>
    <h2 class="section-heading">Preparazione delle sarde</h2>
    <p class="section-subtitle">Sciacqua le sarde sotto un filo d'acqua fredda, controlla che non ci siano squame e asciugale delicatamente con carta assorbente.</p>
  </section>

  <!-- STEP 5 -->
  <section class="section step" data-step="5" id="step-5">
    <span class="step-number">5</span>
    <h2 class="section-heading">Bollitura del finocchietto</h2>
    <p class="section-subtitle">Porta a ebollizione una pentola d'acqua. Aggiungi una generosa manciata di sale grosso e tuffa il finocchietto. Lascia bollire a fiamma media per <strong>20 minuti</strong> finché i rametti non si sfaldano facilmente.</p>
  </section>

  <!-- STEP 6 -->
  <section class="section step" data-step="6" id="step-6">
    <span class="step-number">6</span>
    <h2 class="section-heading">Filtraggio e tritatura</h2>
    <p class="section-subtitle">Scola il finocchietto conservando l'acqua di cottura (acqua verde). Lascia intiepidire, strizzalo benissimo con le mani e tritalo finemente al coltello.</p>
  </section>

  <!-- STEP 7 — Muddica Atturrata (includes color matcher) -->
  <section class="section step" data-step="7" id="step-7">
    <span class="step-number">7</span>
    <h2 class="section-heading">Muddica Atturrata</h2>
    <p class="section-subtitle">In un padellino antiaderente, scalda il pangrattato con un filo d'olio a fuoco bassissimo, mescolando continuamente per 3-4 minuti fino a ottenere un colore nocciola scuro. Fuori dal fuoco, aggiungi lo zucchero, mescola e trasferisci in una ciotola a raffreddare.</p>
    <div id="color-matcher-container"></div>
  </section>

  <!-- STEP 8 -->
  <section class="section step" data-step="8" id="step-8">
    <span class="step-number">8</span>
    <h2 class="section-heading">Soffritto</h2>
    <p class="section-subtitle">In una padella larga, scalda abbondante olio EVO a fuoco minimo. Appassire la cipolla tritata finché non diventa lucida e trasparente. Aggiungi i filetti di acciuga e schiacciali contro il fondo fino a scioglierli. Unisci l'uvetta strizzata e i pinoli, mescola per un minuto.</p>
  </section>

  <!-- STEP 9 -->
  <section class="section step" data-step="9" id="step-9">
    <span class="step-number">9</span>
    <h2 class="section-heading">Condimento</h2>
    <p class="section-subtitle">Aggiungi al soffritto il finocchietto tritato. Sciogli lo zafferano in mezza tazzina di acqua di cottura del finocchietto e versalo nella padella. Disponi le sarde distese sopra il condimento, copri e cuoci a fiamma bassissima per <strong>10 minuti</strong>. Aggiusta di sale e pepe.</p>
  </section>

  <!-- STEP 10 — Cottura pasta (includes smart timer) -->
  <section class="section step" data-step="10" id="step-10">
    <span class="step-number">10</span>
    <h2 class="section-heading">Cottura della pasta</h2>
    <p class="section-subtitle">Porta di nuovo a bollore l'acqua del finocchietto e cala i bucatini. Scolali 2 minuti prima del tempo indicato sulla confezione, conservando un po' d'acqua di cottura.</p>
    <div id="timer-container"></div>
  </section>

  <!-- STEP 11 -->
  <section class="section step" data-step="11" id="step-11">
    <span class="step-number">11</span>
    <h2 class="section-heading">Mantecatura</h2>
    <p class="section-subtitle">Trasferisci i bucatini nella padella con il sugo. Salta a fiamma alta per un minuto, aggiungendo un po' d'acqua di cottura se necessario, finché non si forma una leggera cremina.</p>
  </section>

  <!-- STEP 12 — Impiattamento -->
  <section class="section step" data-step="12" id="step-12">
    <span class="step-number">12</span>
    <h2 class="section-heading">Impiattamento</h2>
    <p class="section-subtitle">Disponi i bucatini a cupola nei piatti fondi, copri con il sugo avanzato ricco di sarde, pinoli e uvetta. Cospargi generosamente con la <em>muddica atturrata</em> e servi immediatamente.</p>
  </section>
```

- [ ] **Step 2: Add step section CSS**

```css
.step {
  background: var(--white);
  text-align: center;
}

.step:nth-child(even) {
  background: var(--cream);
}

.step-number {
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: var(--terracotta-light);
  opacity: 0.3;
  line-height: 1;
}

.step .section-subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  max-width: 650px;
}

.step strong {
  color: var(--terracotta);
}
```

---

### Task 6: Smart Timer (Step 10)

**Files:**
- Modify: `codebase/js/timer.js` (full implementation)
- Modify: `codebase/css/style.css` (timer styles)

- [ ] **Step 1: Add timer CSS**

```css
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.timer-input-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.timer-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  border: 2px solid var(--terracotta);
  background: var(--white);
  color: var(--terracotta);
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  min-width: 48px;
}

.timer-btn:active {
  background: var(--terracotta);
  color: var(--white);
}

.timer-input {
  width: 80px;
  text-align: center;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  border: none;
  border-bottom: 2px solid var(--terracotta-light);
  background: transparent;
  color: var(--terracotta-dark);
  outline: none;
  padding: var(--spacing-sm);
}

.timer-label {
  font-size: 0.85rem;
  color: var(--warm-gray);
}

.timer-display {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: var(--terracotta-dark);
  display: none;
}

.timer-progress-ring {
  width: 120px;
  height: 120px;
  display: none;
}

.timer-controls {
  display: flex;
  gap: var(--spacing-md);
}

.timer-water-alert {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--terracotta);
  color: var(--white);
  padding: var(--spacing-lg);
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 50;
}

.timer-water-alert.active {
  transform: translateY(0);
}

.timer-water-alert .btn-primary {
  margin-top: var(--spacing-md);
  background: var(--white);
  color: var(--terracotta-dark);
}
```

- [ ] **Step 2: Implement timer.js**

```javascript
const SmartTimer = (() => {
  let state = {
    inputMinutes: 10,
    remainingSeconds: 0,
    isRunning: false,
    intervalId: null,
    waterAlertShown: false,
  };

  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="timer-container">
        <div class="timer-input-group">
          <button class="timer-btn" id="timer-minus">−</button>
          <input type="number" class="timer-input" id="timer-input" value="10" min="1" max="30">
          <button class="timer-btn" id="timer-plus">+</button>
        </div>
        <p class="timer-label">Tempo sulla confezione (minuti)</p>
        <div class="timer-display" id="timer-display">10:00</div>
        <svg class="timer-progress-ring" id="timer-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--terracotta-light)" stroke-width="6"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--amber)" stroke-width="6"
            stroke-dasharray="326.7" stroke-dashoffset="0" stroke-linecap="round"
            transform="rotate(-90 60 60)" id="timer-ring-progress"/>
        </svg>
        <div class="timer-controls">
          <button class="btn-primary" id="timer-start">Avvia timer</button>
          <button class="btn-primary" id="timer-reset" style="background:var(--warm-gray);display:none">Annulla</button>
        </div>
      </div>
      <div class="timer-water-alert" id="timer-water-alert">
        <p>Salva un mestolo di acqua di cottura!</p>
        <button class="btn-primary" id="timer-water-dismiss">Fatto!</button>
      </div>
    `;

    const input = document.getElementById('timer-input');
    const minusBtn = document.getElementById('timer-minus');
    const plusBtn = document.getElementById('timer-plus');
    const startBtn = document.getElementById('timer-start');
    const resetBtn = document.getElementById('timer-reset');
    const display = document.getElementById('timer-display');
    const ring = document.getElementById('timer-ring');
    const ringProgress = document.getElementById('timer-ring-progress');
    const waterAlert = document.getElementById('timer-water-alert');
    const waterDismiss = document.getElementById('timer-water-dismiss');

    function getAdjustedSeconds(minutes) {
      const adjusted = Math.max(1, minutes - 2);
      return adjusted * 60;
    }

    function updateDisplay(seconds) {
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      display.textContent = `${m}:${s}`;
    }

    function updateRing(remaining, total) {
      const offset = total > 0 ? 326.7 * (1 - remaining / total) : 0;
      ringProgress.setAttribute('stroke-dashoffset', offset);
    }

    function showTimer() {
      display.style.display = 'block';
      ring.style.display = 'block';
    }

    function hideInput() {
      container.querySelector('.timer-input-group').style.display = 'none';
      container.querySelector('.timer-label').style.display = 'none';
    }

    function showInput() {
      container.querySelector('.timer-input-group').style.display = 'flex';
      container.querySelector('.timer-label').style.display = 'block';
      display.style.display = 'none';
      ring.style.display = 'none';
      waterAlert.classList.remove('active');
    }

    function startTimer() {
      if (state.isRunning) return;
      const raw = parseInt(input.value, 10);
      if (isNaN(raw) || raw < 1) {
        input.value = 10;
        return;
      }
      state.inputMinutes = raw;
      state.remainingSeconds = getAdjustedSeconds(raw);
      state.isRunning = true;
      state.waterAlertShown = false;
      hideInput();
      showTimer();
      updateDisplay(state.remainingSeconds);
      updateRing(state.remainingSeconds, state.remainingSeconds);
      startBtn.textContent = 'In corso...';
      startBtn.style.background = 'var(--success-green)';
      resetBtn.style.display = 'inline-block';

      state.intervalId = setInterval(() => {
        state.remainingSeconds--;
        updateDisplay(state.remainingSeconds);
        updateRing(state.remainingSeconds, getAdjustedSeconds(state.inputMinutes));

        if (!state.waterAlertShown && state.remainingSeconds <= 30 && state.remainingSeconds > 0) {
          state.waterAlertShown = true;
          waterAlert.classList.add('active');
          playWaterChime();
        }

        if (state.remainingSeconds <= 0) {
          clearInterval(state.intervalId);
          state.isRunning = false;
          display.textContent = '00:00';
          startBtn.textContent = 'Completato!';
        }
      }, 1000);
    }

    function resetTimer() {
      if (state.intervalId) clearInterval(state.intervalId);
      state.isRunning = false;
      state.remainingSeconds = 0;
      state.waterAlertShown = false;
      showInput();
      startBtn.textContent = 'Avvia timer';
      startBtn.style.background = '';
      resetBtn.style.display = 'none';
      display.textContent = '00:00';
    }

    function playWaterChime() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.value = 880;
          gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.2);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc2.start(ctx.currentTime + 0.2);
          osc2.stop(ctx.currentTime + 0.35);
        }, 200);
      } catch (_) {}
    }

    minusBtn.addEventListener('click', () => {
      const val = parseInt(input.value, 10);
      if (val > 1) input.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
      const val = parseInt(input.value, 10);
      if (val < 30) input.value = val + 1;
    });

    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);

    waterDismiss.addEventListener('click', () => {
      waterAlert.classList.remove('active');
    });
  }

  return { init };
})();
```

---

### Task 7: Visual Color Matcher (Step 7)

**Files:**
- Modify: `codebase/js/color-matcher.js` (full implementation)
- Modify: `codebase/css/style.css` (color matcher styles)

- [ ] **Step 1: Add color matcher CSS**

```css
.color-matcher {
  margin-top: var(--spacing-lg);
  width: 100%;
  max-width: 500px;
}

.color-matcher-label {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--terracotta-dark);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.color-matcher-track {
  position: relative;
  width: 100%;
  height: 32px;
  border-radius: 16px;
  background: linear-gradient(to right,
    #F5F0E1 0%,
    #E8C87A 20%,
    #D4A843 40%,
    #B8862C 55%,
    #8B6914 70%,
    #5C3D10 85%,
    #1A0F05 100%
  );
  cursor: pointer;
  touch-action: none;
}

.color-matcher-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: var(--white);
  border: 3px solid var(--terracotta);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 2;
}

.color-matcher-status {
  margin-top: var(--spacing-md);
  text-align: center;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 600;
  min-height: 1.6em;
  transition: color 0.2s;
}

.color-matcher-status.perfect {
  color: var(--success-green);
}

.color-matcher-status.warning {
  color: var(--ochre);
}

.color-matcher-status.danger {
  color: var(--danger-red);
}

.color-matcher-pan {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.color-matcher-pan svg {
  width: 80px;
  height: 50px;
}

.color-matcher-pan-fill {
  transition: fill 0.15s;
}
```

- [ ] **Step 2: Implement color-matcher.js**

```javascript
const ColorMatcher = (() => {
  const STOPS = [
    { pos: 0, label: 'Crudo', class: 'warning', color: '#F5F0E1' },
    { pos: 20, label: 'Iniziato', class: 'warning', color: '#E8C87A' },
    { pos: 40, label: 'Perfetto!', class: 'perfect', color: '#D4A843' },
    { pos: 60, label: 'Perfetto!', class: 'perfect', color: '#B8862C' },
    { pos: 75, label: 'Attenzione...', class: 'warning', color: '#8B6914' },
    { pos: 88, label: 'Bruciato!', class: 'danger', color: '#5C3D10' },
    { pos: 100, label: 'Bruciato!', class: 'danger', color: '#1A0F05' },
  ];

  function getStopAtPos(percent) {
    return STOPS.reduce((prev, curr) =>
      Math.abs(curr.pos - percent) < Math.abs(prev.pos - percent) ? curr : prev
    );
  }

  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="color-matcher">
        <p class="color-matcher-label">📍 Confronta il colore del pangrattato</p>
        <div class="color-matcher-pan">
          <svg viewBox="0 0 120 60">
            <ellipse cx="60" cy="30" rx="50" ry="20" fill="none" stroke="var(--charcoal)" stroke-width="1.5" opacity="0.3"/>
            <ellipse cx="60" cy="30" rx="50" ry="20" fill="#F5F0E1" class="color-matcher-pan-fill" id="pan-fill" opacity="0.6"/>
            <path d="M10 30 Q10 10 60 10 Q110 10 110 30" fill="none" stroke="var(--charcoal)" stroke-width="2" opacity="0.3"/>
            <line x1="60" y1="10" x2="60" y2="5" stroke="var(--charcoal)" stroke-width="2" opacity="0.3"/>
          </svg>
        </div>
        <div class="color-matcher-track" id="color-track">
          <div class="color-matcher-thumb" id="color-thumb" style="left:0%"></div>
        </div>
        <p class="color-matcher-status" id="color-status">Crudo</p>
      </div>
    `;

    const track = document.getElementById('color-track');
    const thumb = document.getElementById('color-thumb');
    const status = document.getElementById('color-status');
    const panFill = document.getElementById('pan-fill');

    function setPosition(percent) {
      const clamped = Math.max(0, Math.min(100, percent));
      thumb.style.left = `${clamped}%`;
      const stop = getStopAtPos(clamped);
      status.textContent = stop.label;
      status.className = `color-matcher-status ${stop.class}`;
      panFill.setAttribute('fill', stop.color);
    }

    function handleMove(clientX) {
      const rect = track.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setPosition(percent);
    }

    track.addEventListener('mousedown', (e) => {
      handleMove(e.clientX);
      function onMove(ev) { handleMove(ev.clientX); }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    track.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    });

    track.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    });
  }

  return { init };
})();
```

---

### Task 8: Audio Finale & Gestures / Navigation

**Files:**
- Modify: `codebase/js/audio.js` (full implementation)
- Modify: `codebase/js/gestures.js` (full implementation)
- Modify: `codebase/css/style.css` (finale section styles)
- Modify: `codebase/index.html` (finale section + similar recipe section)

- [ ] **Step 1: Implement audio.js (Web Audio API — Safari autoplay workaround)**

```javascript
const RecipeAudio = (() => {
  let audioCtx = null;
  let audioBuffer = null;
  let isLoaded = false;

  function init() {
    fetchAudio();
  }

  async function fetchAudio() {
    try {
      const response = await fetch('assets/audio/minchia-bravo.m4a');
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await decodeAudio(arrayBuffer);
      isLoaded = true;
    } catch (_) {
      isLoaded = false;
    }
  }

  function decodeAudio(buffer) {
    return new Promise((resolve, reject) => {
      if (audioCtx) {
        audioCtx.decodeAudioData(buffer, resolve, reject);
      } else {
        reject(new Error('AudioContext not created yet'));
      }
    });
  }

  // Called on user gesture (click "Inizia la ricetta")
  function unlock() {
    if (audioCtx && audioCtx.state !== 'closed') return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.resume();
      if (!audioBuffer) fetchAudio();
    } catch (_) {}
  }

  function playFinale() {
    if (!audioCtx || !audioBuffer || !isLoaded) return;
    try {
      audioCtx.resume();
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start(0);
    } catch (_) {}
  }

  return { init, unlock, playFinale };
})();
```

- [ ] **Step 2: Implement gestures.js**

```javascript
const Gestures = (() => {
  let startX = 0;
  let startY = 0;

  function init() {
    const app = document.getElementById('app');
    let isScrolling = false;

    app.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    app.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (isScrolling) return;
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 500);

        const sections = [...document.querySelectorAll('.section')];
        const current = app.scrollTop;
        const sectionHeight = window.innerHeight;
        const currentIndex = Math.round(current / sectionHeight);

        if (diffX < 0 && currentIndex < sections.length - 1) {
          sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (diffX > 0 && currentIndex > 0) {
          sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, { passive: true });
  }

  return { init };
})();
```

- [ ] **Step 3: Add finale and similar recipe HTML (after step 12, before closing #app)**

```html
  <!-- FINALE -->
  <section class="section finale" id="finale">
    <div class="finale-content">
      <div class="finale-illustration">
        <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="80" cy="70" rx="50" ry="30" fill="var(--amber)" opacity="0.2"/>
          <path d="M50 55 Q65 35 80 55 Q95 35 110 55" stroke="var(--amber)" stroke-width="2" fill="none"/>
          <circle cx="65" cy="60" r="3" fill="var(--ochre)" opacity="0.6"/>
          <circle cx="95" cy="60" r="3" fill="var(--ochre)" opacity="0.6"/>
          <path d="M20 85 Q40 70 80 85 Q120 70 140 85" stroke="var(--terracotta)" stroke-width="1.5" fill="none" opacity="0.5"/>
        </svg>
      </div>
      <h2 class="finale-title">MINCHIA BRAVO</h2>
      <p class="finale-subtitle">ORA MANGIA!</p>
    </div>
  </section>

  <!-- SIMILAR RECIPE -->
  <section class="section similar" id="similar">
    <div class="similar-divider">
      <svg viewBox="0 0 300 20" width="300" height="20">
        <path d="M0 10 Q30 0 60 10 Q90 20 120 10 Q150 0 180 10 Q210 20 240 10 Q270 0 300 10" stroke="var(--terracotta-light)" stroke-width="1.5" fill="none" opacity="0.5"/>
      </svg>
    </div>
    <h2 class="section-heading">Potrebbe piacerti anche...</h2>
    <div class="similar-card">
      <div class="similar-card-icon">
        <svg viewBox="0 0 60 60" width="48" height="48">
          <circle cx="30" cy="30" r="24" fill="var(--amber)" opacity="0.15"/>
          <circle cx="30" cy="30" r="16" fill="var(--terracotta)" opacity="0.1"/>
          <path d="M24 26 L30 20 L36 26" stroke="var(--ochre)" stroke-width="2" fill="none"/>
          <path d="M30 20 L30 38" stroke="var(--ochre)" stroke-width="2"/>
        </svg>
      </div>
      <div class="similar-card-body">
        <h3 class="similar-card-title">Sarde a Beccafico</h3>
        <p class="similar-card-desc">Un'altra ricetta tradizionale siciliana a base di sarde, pinoli e uvetta.</p>
      </div>
      <button class="btn-primary similar-card-btn" disabled>Vedi ricetta</button>
    </div>
  </section>
```

- [ ] **Step 4: Add finale and similar recipe CSS**

```css
.finale {
  background: linear-gradient(135deg, var(--terracotta-dark) 0%, #2C1810 100%);
  color: var(--white);
}

.finale-content {
  text-align: center;
  animation: fadeInUp 0.8s ease;
}

.finale-illustration svg {
  width: 140px;
  height: 105px;
  margin-bottom: var(--spacing-lg);
}

.finale-title {
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--amber);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  margin-bottom: var(--spacing-sm);
}

.finale-subtitle {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-style: italic;
  color: var(--amber-light);
  opacity: 0.9;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.similar {
  background: var(--cream);
  text-align: center;
  gap: var(--spacing-md);
}

.similar-divider {
  margin-bottom: var(--spacing-md);
}

.similar-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--terracotta-light);
  max-width: 550px;
  width: 100%;
}

.similar-card-body {
  flex: 1;
  text-align: left;
}

.similar-card-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--terracotta-dark);
  margin-bottom: var(--spacing-sm);
}

.similar-card-desc {
  font-size: 0.9rem;
  color: var(--warm-gray);
  line-height: 1.5;
}

.similar-card .btn-primary {
  flex-shrink: 0;
  min-width: auto;
  padding: 12px 24px;
  font-size: 0.9rem;
}

.similar-card .btn-primary:disabled {
  background: var(--warm-gray);
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

---

### Task 9: App Initialization (app.js)

**Files:**
- Modify: `codebase/js/app.js` (wire everything together)

- [ ] **Step 1: Implement app.js**

```javascript
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    RecipeAudio.init();
    Gestures.init();
    Checklist.init();
    SmartTimer.init('timer-container');
    ColorMatcher.init('color-matcher-container');

    const startBtn = document.getElementById('start-recipe');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        RecipeAudio.unlock();
      });
    }

    const stepSections = document.querySelectorAll('.step');
    const appEl = document.getElementById('app');
    const finaleSection = document.getElementById('finale');

    let finalePlayed = false;

    function checkFinale() {
      if (finalePlayed) return;
      if (!finaleSection) return;
      const rect = finaleSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) {
        finalePlayed = true;
        RecipeAudio.playFinale();
      }
    }

    if (appEl) {
      appEl.addEventListener('scroll', () => {
        checkFinale();
      }, { passive: true });
    }

    const step10 = document.getElementById('step-10');
    if (step10) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            SmartTimer.init('timer-container');
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(step10);
    }
  });
})();
```

---

### Task 10: Polish — Responsive, Animations, Final Pass

**Files:**
- Modify: `codebase/css/style.css` (responsive breakpoints, animations, final touches)
- Modify: `codebase/index.html` (verify all sections complete)

- [ ] **Step 1: Add responsive breakpoints**

```css
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-heading {
    font-size: 1.8rem;
  }

  .section-subtitle {
    font-size: 1rem;
    padding: 0 var(--spacing-md);
  }

  .step-number {
    font-size: 2rem;
    top: var(--spacing-md);
    left: var(--spacing-md);
  }

  .checklist-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .checklist-modal {
    padding: var(--spacing-lg);
  }

  .finale-title {
    font-size: 2.5rem;
  }

  .similar-card {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-md);
  }

  .similar-card-body {
    text-align: center;
  }

  .timer-input {
    font-size: 1.5rem;
    width: 60px;
  }

  .timer-display {
    font-size: 2rem;
  }

  .btn-primary {
    padding: 14px 32px;
    font-size: 1.1rem;
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .checklist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .checklist-item {
    padding: var(--spacing-sm);
    min-height: 60px;
  }

  .checklist-label {
    font-size: 0.75rem;
  }
}
```

- [ ] **Step 2: Add smooth fade transition between sections**

```css
.section {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.section:nth-child(-n+2),
.section.visible {
  opacity: 1;
}
```

Update app.js to add a visibility observer:

```javascript
// Add to DOMContentLoaded in app.js
const allSections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

allSections.forEach(s => sectionObserver.observe(s));
```

---

### Spec Coverage Checklist

- **Hero section with "Inizia la ricetta" CTA** → Task 3
- **Mise en place checklist (12 ingredients, chime, lock until all checked, localStorage)** → Task 4
- **Recipe steps 1–12 in scroll-snap sections** → Task 5
- **Smart timer with -2 min, progress ring, +/- buttons** → Task 6
- **Water-saving notification at 30s with chime** → Task 6
- **Visual color matcher gradient bar with labels** → Task 7
- **Audio finale with Sicilian voice** → Task 8
- **Hands-free swipe gestures** → Task 8
- **Similar recipe section** → Task 8
- **EB Garamond font** → Task 1
- **App initialization wiring** → Task 9
- **Responsive design** → Task 10
- **Animations / fade-in** → Task 10
