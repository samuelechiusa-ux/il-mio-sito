# Design System Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a single-page portfolio site that collects 5 workshop exercises, with a physics-based home page and SPA-style navigation with animated transitions.

**Architecture:** Vanilla HTML/CSS/JS with no build tools. Matter.js for 2D physics. Adobe Fonts (Snaga Unicase Display) for typography. The home page is the SPA entry point; each project page is a generated detail view with an iframe preview linking to the standalone project HTML. Projects remain untouched in their original directories.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS (ES6+), Matter.js (CDN), Adobe Fonts.

---

## File Structure

```
IL SITO/
├── index.html                   # SPA entry point
├── css/
│   ├── design-system.css        # CSS variables, reset, typography, animations
│   └── home.css                 # Home page, detail page, fullscreen styles
├── js/
│   ├── app.js                   # App state machine, SPA navigation, event wiring
│   ├── physics.js               # Matter.js setup, shapes, safe area, drag
│   └── data.js                  # Project metadata + DOM generators
├── ASSETS/                      # SVG shapes (already exist)
├── manorietta/                  # Unchanged
├── MASCHERA ANIMATA/            # Unchanged
├── tipografia cinetica/         # Unchanged
├── tipografia cinetica copia/   # Unchanged
├── pasta alla palermitana/      # Unchanged
└── finestra con LUCE 2/         # Unchanged
```

---

### Task 1: Design System CSS

**Files:**
- Create: `css/design-system.css`

- [ ] **Step 1: Write design-system.css**

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-bg: #f2fbfc;
  --color-text: #232323;
  --color-hover: #b70000;
  --color-active: #ed0000;

  --font-primary: "snaga-unicase-display", sans-serif;
  --weight-semibold: 600;
  --weight-light: 300;

  --text-title: clamp(3rem, 8vw, 7.2rem);
  --text-title-open: clamp(5rem, 15vw, 14rem);
  --text-subtitle: clamp(1.2rem, 3vw, 2.8rem);
  --text-project-name: 1rem;

  --svg-size: clamp(80px, 10vw, 140px);
  --svg-size-mini: 48px;
  --safe-radius: 200px;

  --transition-default: 0.3s ease;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: var(--font-primary);
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}
```

---

### Task 2: Home Page HTML

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>portfolio — samuele chiusa</title>
  <link rel="stylesheet" href="https://use.typekit.net/jit0hru.css">
  <link rel="stylesheet" href="css/design-system.css">
  <link rel="stylesheet" href="css/home.css">
</head>
<body>
  <div id="app">
    <div id="home-view" class="view active">
      <div id="home-center">
        <h1 id="home-title" class="home-title">la mia home</h1>
        <p id="home-subtitle" class="home-subtitle">di samuele chiusa</p>
      </div>
      <div id="physics-container"></div>
    </div>

    <div id="detail-view" class="view">
      <div id="detail-content">
        <div id="preview-container">
          <div id="preview-frame" class="preview-frame">
            <iframe id="preview-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
            <div id="preview-badge" class="preview-badge">clicca per esplorare</div>
          </div>
        </div>
        <div id="project-info">
          <h2 id="project-title" class="project-title"></h2>
          <p id="project-description" class="project-description"></p>
        </div>
      </div>
      <div id="mini-logo" class="mini-logo"></div>
    </div>

    <div id="fullscreen-overlay" class="fullscreen-overlay">
      <iframe id="fullscreen-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
  <script src="js/physics.js"></script>
  <script src="js/data.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

### Task 3: Home Page CSS

**Files:**
- Create: `css/home.css`

- [ ] **Step 1: Write home.css**

```css
#app {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.view {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.view.active {
  opacity: 1;
  pointer-events: auto;
}

/* HOME VIEW */
#home-view {
  display: flex;
  align-items: center;
  justify-content: center;
}

#home-center {
  position: relative;
  z-index: 10;
  text-align: center;
  pointer-events: none;
}

.home-title {
  font-family: var(--font-primary);
  font-weight: var(--weight-semibold);
  font-size: var(--text-title);
  color: var(--color-text);
  cursor: pointer;
  pointer-events: auto;
  transition: color var(--transition-default), font-size 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  user-select: none;
  animation: fadeIn 1s ease forwards;
}

.home-title:hover {
  color: var(--color-hover);
}

.home-title:active {
  color: var(--color-active);
}

.home-title.is-open {
  font-size: var(--text-title-open);
}

.home-title.is-open:hover {
  color: rgba(35, 35, 35, 0.6);
}

.home-subtitle {
  font-family: var(--font-primary);
  font-weight: var(--weight-light);
  font-size: var(--text-subtitle);
  color: var(--color-text);
  margin-top: 0.5rem;
  transition: opacity 0.5s ease;
  animation: fadeIn 1.2s ease forwards;
}

.home-subtitle.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* PHYSICS CANVAS */
#physics-container {
  position: absolute;
  inset: 0;
  z-index: 5;
}

#physics-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* SVG SHAPES */
.svg-shape {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.svg-shape:hover {
  transform: scale(1.08);
}

/* DETAIL VIEW */
#detail-view {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

#detail-content {
  max-width: 800px;
  width: 100%;
  margin-top: 2rem;
}

.preview-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.preview-frame:hover {
  transform: scale(1.02);
}

.preview-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.preview-badge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-family: var(--font-primary);
  font-weight: var(--weight-light);
  font-size: 1.2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.preview-frame:hover .preview-badge {
  opacity: 1;
}

.project-title {
  font-family: var(--font-primary);
  font-weight: var(--weight-semibold);
  font-size: 2rem;
  margin: 1.5rem 0 0.5rem;
  color: var(--color-text);
}

.project-description {
  font-family: var(--font-primary);
  font-weight: var(--weight-light);
  font-size: 1rem;
  color: var(--color-text);
  line-height: 1.6;
}

/* MINI LOGO */
.mini-logo {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: var(--svg-size-mini);
  height: var(--svg-size-mini);
  cursor: pointer;
  z-index: 100;
  transition: transform 0.3s ease;
}

.mini-logo:hover {
  transform: scale(1.08);
}

.mini-logo svg {
  width: 100%;
  height: 100%;
}

/* FULLSCREEN OVERLAY */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.fullscreen-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.fullscreen-overlay iframe {
  width: 100%;
  height: 100%;
  border: none;
}
```

---

### Task 4: Data Module (JS)

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: Write data.js**

```js
const PROJECTS = [
  {
    id: 'manorietta',
    title: 'manorietta',
    svg: 'ASSETS/manorietta.svg',
    color: '#ffae4d',
    path: 'manorietta/index.html',
    description: 'Hands-free pong con MediaPipe e TensorFlow.js'
  },
  {
    id: 'tipografia-cinetica',
    title: 'tipografia cinetica',
    svg: 'ASSETS/tipografia cinetica.svg',
    color: '#6b3135',
    path: 'tipografia cinetica/index.html',
    description: 'Tipografia 3D generativa con Three.js e shader GLSL'
  },
  {
    id: 'pasta-alla-palermitana',
    title: 'pasta alla palermitana',
    svg: 'ASSETS/pasta alla palermitana.svg',
    color: '#dd0303',
    path: 'pasta alla palermitana/codebase/index.html',
    description: 'Esperienza interattiva sulla ricetta della pasta alla palermitana'
  },
  {
    id: 'maschera-animata',
    title: 'maschera animata',
    svg: 'ASSETS/maschera animata. 2.svg',
    color: '#50ff86',
    path: 'MASCHERA ANIMATA/index.html',
    description: 'Maschera animata reattiva al microfono'
  },
  {
    id: 'finestra-con-luce',
    title: 'finestra con luce',
    svg: 'ASSETS/finestra con luce.svg',
    color: '#ff4500',
    path: 'finestra con LUCE 2/index.html',
    description: 'Pattern design e finestra con luce'
  }
];
```

---

### Task 5: Physics Module (Matter.js)

**Files:**
- Create: `js/physics.js`

- [ ] **Step 1: Write physics.js**

```js
const Physics = (() => {
  let engine, world;
  let shapes = [];
  let container;
  let safeAreaBody;
  let mouseConstraint;

  function init() {
    const { Engine, World, Bodies, Body, Events, Mouse, MouseConstraint, Vector } = Matter;

    container = document.getElementById('physics-container');
    engine = Engine.create({
      gravity: { x: 0, y: 0 }
    });
    world = engine.world;

    const { offsetWidth: w, offsetHeight: h } = container;
    const wallOpts = { isStatic: true, restitution: 0.8, friction: 0.1 };

    const walls = [
      Bodies.rectangle(w / 2, -25, w, 50, wallOpts),
      Bodies.rectangle(w / 2, h + 25, w, 50, wallOpts),
      Bodies.rectangle(-25, h / 2, 50, h, wallOpts),
      Bodies.rectangle(w + 25, h / 2, 50, h, wallOpts)
    ];
    World.add(world, walls);

    const safeRadius = 200;
    safeAreaBody = Bodies.circle(w / 2, h / 2, safeRadius, {
      isStatic: true,
      restitution: 0.8,
      label: 'safeArea'
    });
    World.add(world, safeAreaBody);

    const mouse = Mouse.create(container);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(world, mouseConstraint);

    container.addEventListener('touchstart', (e) => {
      if (e.target === container) e.preventDefault();
    }, { passive: false });

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        if (pair.bodyA.label === 'safeArea' || pair.bodyB.label === 'safeArea') {
          const shape = pair.bodyA.label !== 'safeArea' ? pair.bodyA : pair.bodyB;
          const { x, y } = shape.position;
          const cx = w / 2, cy = h / 2;
          const dx = x - cx, dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < safeRadius + 50) {
            const angle = Math.atan2(dy, dx);
            Body.setPosition(shape, {
              x: cx + Math.cos(angle) * (safeRadius + 60),
              y: cy + Math.sin(angle) * (safeRadius + 60)
            });
          }
        }
      });
    });

    updateLoop();
  }

  function updateLoop() {
    Matter.Engine.update(engine, 1000 / 60);
    shapes.forEach(shape => {
      const el = shape.element;
      if (el) {
        const { x, y } = shape.body.position;
        const angle = shape.body.angle;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}rad)`;
      }
    });
    requestAnimationFrame(updateLoop);
  }

  function loadShapes(projectList, onShapeClick) {
    const { World, Bodies, Body } = Matter;
    const { offsetWidth: w, offsetHeight: h } = container;

    shapes.forEach(s => {
      if (s.element) s.element.remove();
    });
    shapes = [];

    let safeBodies = Matter.Composite.allBodies(world).filter(b => b.label === 'safeArea');

    projectList.forEach((project, i) => {
      const el = document.createElement('div');
      el.className = 'svg-shape';
      el.style.position = 'absolute';
      el.style.width = 'var(--svg-size)';
      el.style.height = 'var(--svg-size)';
      el.style.zIndex = '20';
      el.style.pointerEvents = 'auto';

      const angle = (2 * Math.PI / projectList.length) * i;
      const radius = Math.min(w, h) * 0.2;
      const cx = w / 2, cy = h / 2;
      const startX = cx + Math.cos(angle) * radius;
      const startY = cy + Math.sin(angle) * radius;

      const body = Bodies.circle(startX, startY, 40, {
        restitution: 0.8,
        friction: 0.05,
        frictionAir: 0.01,
        density: 0.002
      });
      body.label = project.id;

      el.projectId = project.id;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onShapeClick(project, el, body);
      });

      el.style.transform = `translate(-50%, -50%) translate(${startX}px, ${startY}px) rotate(0rad)`;
      container.appendChild(el);
      World.add(world, body);

      fetch(project.svg)
        .then(r => r.text())
        .then(svgContent => {
          el.innerHTML = svgContent;
          const svgEl = el.querySelector('svg');
          if (svgEl) {
            svgEl.style.width = '100%';
            svgEl.style.height = '100%';
            svgEl.style.pointerEvents = 'none';
          }
        });

      shapes.push({ element: el, body, project });
    });

    return shapes;
  }

  function clearShapes() {
    const { World, Composite } = Matter;
    shapes.forEach(s => {
      if (s.element) s.element.remove();
      World.remove(world, s.body);
    });
    shapes = [];
  }

  function pause() {
    Matter.Engine.clear(engine);
  }

  function start() {
    engine.enabled = true;
  }

  function setGravityZero() {
    engine.gravity.x = 0;
    engine.gravity.y = 0;
  }

  function updateDimensions() {
    const { offsetWidth: w, offsetHeight: h } = container;
    if (safeAreaBody) {
      Matter.Body.setPosition(safeAreaBody, { x: w / 2, y: h / 2 });
    }
  }

  function getElementForBody(body) {
    return shapes.find(s => s.body === body)?.element;
  }

  return {
    init,
    loadShapes,
    clearShapes,
    pause,
    start,
    setGravityZero,
    updateDimensions,
    getElementForBody
  };
})();
```

---

### Task 6: App Module — State Machine & SPA Navigation

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: Write app.js**

```js
const App = (() => {
  const state = {
    currentView: 'home',
    isOpen: false,
    currentProject: null
  };

  const homeTitle = document.getElementById('home-title');
  const homeSubtitle = document.getElementById('home-subtitle');
  const homeView = document.getElementById('home-view');
  const detailView = document.getElementById('detail-view');
  const fullscreenOverlay = document.getElementById('fullscreen-overlay');
  const fullscreenIframe = document.getElementById('fullscreen-iframe');
  const previewIframe = document.getElementById('preview-iframe');
  const previewFrame = document.getElementById('preview-frame');
  const previewBadge = document.getElementById('preview-badge');
  const projectTitle = document.getElementById('project-title');
  const projectDescription = document.getElementById('project-description');
  const miniLogo = document.getElementById('mini-logo');

  function init() {
    Physics.init();

    homeTitle.addEventListener('click', toggleHome);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.currentView === 'fullscreen') {
        closeFullscreen();
      }
    });

    previewFrame.addEventListener('click', openFullscreen);
    miniLogo.addEventListener('click', backToHome);

    window.addEventListener('resize', () => {
      Physics.updateDimensions();
    });
  }

  function toggleHome() {
    if (!state.isOpen) {
      openProjects();
    } else {
      closeProjects();
    }
  }

  function openProjects() {
    state.isOpen = true;
    homeTitle.classList.add('is-open');
    homeSubtitle.classList.add('is-hidden');

    Physics.loadShapes(PROJECTS, (project, el, body) => {
      navigateToProject(project, el, body);
    });

    Physics.start();
  }

  function closeProjects() {
    state.isOpen = false;
    homeTitle.classList.remove('is-open');
    homeSubtitle.classList.remove('is-hidden');
    Physics.clearShapes();
  }

  function navigateToProject(project, el, body) {
    state.currentProject = project;

    const rect = el.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    Physics.clearShapes();
    homeTitle.classList.remove('is-open');
    homeSubtitle.classList.remove('is-hidden');

    el.style.position = 'fixed';
    el.style.width = 'var(--svg-size-mini)';
    el.style.height = 'var(--svg-size-mini)';
    el.style.zIndex = '100';
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.pointerEvents = 'none';
    el.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    document.body.appendChild(el);

    const endX = window.innerWidth - 80;
    const endY = 60;
    requestAnimationFrame(() => {
      el.style.left = endX + 'px';
      el.style.top = endY + 'px';
      el.style.width = 'var(--svg-size-mini)';
      el.style.height = 'var(--svg-size-mini)';
      el.style.transform = 'translate(-50%, -50%) rotate(720deg)';
    });

    setTimeout(() => {
      el.style.display = 'none';
      showDetailView(project);
    }, 700);
  }

  function showDetailView(project) {
    homeView.classList.remove('active');
    homeView.style.opacity = '0';

    const svgClone = document.createElement('div');
    svgClone.innerHTML = '';
    fetch(project.svg)
      .then(r => r.text())
      .then(svgContent => {
        svgClone.innerHTML = svgContent;
        const svgEl = svgClone.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = '100%';
          svgEl.style.pointerEvents = 'none';
        }
      });
    miniLogo.innerHTML = '';
    miniLogo.appendChild(svgClone.firstElementChild || svgClone);
    miniLogo.projectId = project.id;

    previewIframe.src = project.path;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;

    detailView.classList.add('active');
    detailView.style.opacity = '1';

    state.currentView = 'detail';

    let rotation = 0;
    const onScroll = () => {
      rotation += 0.3;
      miniLogo.style.transform = `rotate(${rotation}deg)`;
    };
    window.addEventListener('scroll', onScroll);
    miniLogo._scrollHandler = onScroll;
  }

  function backToHome() {
    if (state.currentView !== 'detail') return;

    const project = state.currentProject;
    detailView.style.opacity = '0';
    detailView.classList.remove('active');

    const el = document.createElement('div');
    el.className = 'svg-shape';
    el.style.position = 'fixed';
    el.style.width = 'var(--svg-size-mini)';
    el.style.height = 'var(--svg-size-mini)';
    el.style.zIndex = '100';
    el.style.left = (window.innerWidth - 80) + 'px';
    el.style.top = '60px';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    document.body.appendChild(el);

    fetch(project.svg)
      .then(r => r.text())
      .then(svgContent => {
        el.innerHTML = svgContent;
        const svgEl = el.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = '100%';
          svgEl.style.pointerEvents = 'none';
        }
      });

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const angle = (2 * Math.PI / PROJECTS.length) * PROJECTS.indexOf(project);
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.2;
    const endX = cx + Math.cos(angle) * radius;
    const endY = cy + Math.sin(angle) * radius;

    requestAnimationFrame(() => {
      el.style.left = endX + 'px';
      el.style.top = endY + 'px';
      el.style.width = 'var(--svg-size)';
      el.style.height = 'var(--svg-size)';
      el.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    });

    miniLogo.innerHTML = '';
    if (miniLogo._scrollHandler) {
      window.removeEventListener('scroll', miniLogo._scrollHandler);
    }
    previewIframe.src = '';

    homeTitle.classList.remove('is-open');
    homeSubtitle.classList.remove('is-hidden');
    homeView.style.opacity = '1';

    setTimeout(() => {
      el.remove();
      homeView.classList.add('active');
      closeProjects();
      openProjects();
      state.currentView = 'home';
    }, 700);
  }

  function openFullscreen() {
    if (state.currentView !== 'detail' || !state.currentProject) return;
    fullscreenIframe.src = state.currentProject.path;
    fullscreenOverlay.classList.add('active');
    state.currentView = 'fullscreen';
  }

  function closeFullscreen() {
    fullscreenOverlay.classList.remove('active');
    fullscreenIframe.src = '';
    state.currentView = 'detail';
  }

  document.addEventListener('DOMContentLoaded', init);
  return { init, openProjects, closeProjects };
})();
```

---

### Task 7: Style Refinements & Polish

**Files:**
- Modify: `css/home.css`

- [ ] **Step 1: Add scroll support for detail view**

In the spec, `#detail-view` has `overflow-y: auto` but detail content may need proper padding for empty state. Add these refinements:

```css
#detail-view {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

#project-info {
  padding-bottom: 4rem;
}

.mini-logo svg {
  width: 100%;
  height: 100%;
  display: block;
}
```

- [ ] **Step 2: Add responsive adjustments**

```css
@media (max-width: 600px) {
  #detail-content {
    padding-top: 4rem;
  }

  .preview-frame {
    aspect-ratio: 4 / 3;
  }

  .project-title {
    font-size: 1.4rem;
  }

  .mini-logo {
    top: 0.75rem;
    right: 0.75rem;
    width: 36px;
    height: 36px;
  }
}
```

---

### Task 8: Verify Everything Works

- [ ] **Step 1: Test home page load**

Open `index.html` in a browser. Verify:
- "la mia home" appears with fade-in animation
- "di samuele chiusa" appears below it
- Font is Snaga Unicase Display (Adobe Fonts loaded)
- Background is #f2fbfc

- [ ] **Step 2: Test toggle mechanism**

Click "la mia home". Verify:
- Title grows to expanded size
- Subtitle fades out
- SVG shapes appear with stagger animation
- Physics simulation is running (shapes float and collide)

- [ ] **Step 3: Test shape interaction**

While shapes are visible:
- Hover over a shape → scale(1.08)
- Drag a shape → follows mouse
- Release → shape keeps inertia
- Shapes bounce off walls and each other
- Shapes do not overlap the center title area

- [ ] **Step 4: Test navigation to project detail**

Click a shape. Verify:
- All other shapes and title fade out
- Clicked shape shrinks and moves to upper right with spin
- Detail view appears with iframe preview
- Badge "clicca per esplorare" appears on hover
- Project title and description are shown
- Mini-logo is in upper right corner

- [ ] **Step 5: Test fullscreen interaction**

Click the preview iframe. Verify:
- Fullscreen overlay appears
- Project loads in iframe (interactable)
- Press Esc → fullscreen closes, returns to detail view

- [ ] **Step 6: Test return to home**

Click the mini-logo. Verify:
- Detail view fades out
- Mini-logo animates back to center and grows
- Home view reappears with all shapes and physics
- Title and subtitle are restored
