# Hands-Free Pong Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-based hands-free Pong game controlled via hand tracking using `@tensorflow-models/hand-pose-detection` with MediaPipe runtime.

**Architecture:** Single HTML page loading hand-pose-detection via CDN. Vanilla JS modules separated by responsibility (physics, hands, state machine, renderer, AI). Game loop driven by `requestAnimationFrame`. No bundler — all scripts loaded via `<script>` tags.

**Tech Stack:** HTML5 Canvas, `@tensorflow-models/hand-pose-detection` (CDN), `@mediapipe/hands` (CDN), Vanilla JS

---

## File Structure

```
manorietta/
├── index.html                    Entry point — canvas, overlay UI, script loads
├── js/
│   ├── config.js                 Constants and tuning knobs
│   ├── physics.js                Vec2, collision detection, bounce logic
│   ├── hands.js                  MediaPipe hand tracking integration
│   ├── stateMachine.js           Game states and transitions
│   ├── renderer.js               80s retro canvas drawing
│   ├── ai.js                     CPU opponent logic
│   ├── game.js                   Frame orchestration (update + draw)
│   └── main.js                   Boot: camera init, detector create, start loop
```

---

### Task 1: Project scaffolding — index.html

**Files:**
- Create: `index.html`
- Create: `js/config.js`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hands-Free Pong</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    }
    #game-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #scoreboard {
      display: flex;
      justify-content: space-between;
      width: 800px;
      padding: 10px 40px;
      color: #fff;
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 4px;
    }
    #score-left { color: #00ffff; text-shadow: 0 0 10px #00ffff; }
    #score-right { color: #ff00ff; text-shadow: 0 0 10px #ff00ff; }
    #canvas {
      border: 2px solid #333;
      display: block;
      background: #0a0a0a;
    }
    #status-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 32px;
      text-shadow: 0 0 20px #fff;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }
    #status-overlay.visible { opacity: 1; }
    #controls {
      margin-top: 12px;
      display: flex;
      gap: 16px;
    }
    #controls button {
      background: transparent;
      border: 1px solid #555;
      color: #aaa;
      padding: 6px 16px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      font-size: 14px;
    }
    #controls button.active {
      border-color: #fff;
      color: #fff;
    }
    #debug {
      margin-top: 8px;
      color: #555;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="game-wrapper">
    <div id="scoreboard">
      <span id="score-left">0</span>
      <span id="score-right">0</span>
    </div>
    <div style="position:relative">
      <canvas id="canvas" width="800" height="600"></canvas>
      <div id="status-overlay">READY</div>
    </div>
    <div id="controls">
      <button id="mode-1p" class="active">1P (vs CPU)</button>
      <button id="mode-2p">2P (vs Human)</button>
    </div>
    <div id="debug">Waiting for camera...</div>
  </div>

  <!-- MediaPipe deps -->
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>

  <!-- Game scripts (order matters — each depends on previous) -->
  <script src="js/config.js"></script>
  <script src="js/physics.js"></script>
  <script src="js/hands.js"></script>
  <script src="js/stateMachine.js"></script>
  <script src="js/renderer.js"></script>
  <script src="js/ai.js"></script>
  <script src="js/game.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create js/config.js**

```js
const CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  BALL_RADIUS: 8,
  BALL_INITIAL_SPEED: 300,
  BALL_MAX_SPEED: 800,
  MAX_WALL_WIDTH: 400,
  PROXIMITY_THRESHOLD: 100,
  GOAL_PAUSE_MS: 1500,
  AI_DIFFICULTY: 0.7,
  NEON_CYAN: '#00ffff',
  NEON_MAGENTA: '#ff00ff',
  BACKGROUND: '#0a0a0a',
  HAND_CONFIDENCE_MIN: 0.5,
};
```

---

### Task 2: Physics engine — physics.js

**Files:**
- Create: `js/physics.js`

- [ ] **Step 1: Create Vec2 and Ball classes**

```js
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
  scale(s) { return new Vec2(this.x * s, this.y * s); }
  length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  normalize() {
    const len = this.length();
    return len > 0 ? new Vec2(this.x / len, this.y / len) : new Vec2(0, 0);
  }
}

class Ball {
  constructor() {
    this.pos = new Vec2(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    this.vel = new Vec2(0, 0);
    this.radius = CONFIG.BALL_RADIUS;
    this.active = false;
  }
  launch() {
    const angle = (Math.random() - 0.5) * Math.PI * 0.8;
    const dir = new Vec2(Math.cos(angle), Math.sin(angle));
    if (Math.abs(dir.x) < 0.3) dir.x = dir.x >= 0 ? 0.3 : -0.3;
    dir.x *= Math.random() > 0.5 ? 1 : -1;
    this.vel = dir.normalize().scale(CONFIG.BALL_INITIAL_SPEED);
    this.active = true;
  }
  update(dt) {
    if (!this.active) return;
    this.pos = this.pos.add(this.vel.scale(dt));
  }
}
```

- [ ] **Step 2: Implement collision detection**

```js
function getWallRect(side, width) {
  if (side === 'left') {
    return { x: 0, y: 0, w: width, h: CONFIG.CANVAS_HEIGHT };
  }
  return { x: CONFIG.CANVAS_WIDTH - width, y: 0, w: width, h: CONFIG.CANVAS_HEIGHT };
}

function ballIntersectsRect(ball, rect) {
  const cx = Math.max(rect.x, Math.min(ball.pos.x, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(ball.pos.y, rect.y + rect.h));
  const dx = ball.pos.x - cx;
  const dy = ball.pos.y - cy;
  return (dx * dx + dy * dy) < (ball.radius * ball.radius);
}

function handleCollisions(ball, leftWallWidth, rightWallWidth) {
  if (!ball.active) return null;

  // Top / bottom bounce
  if (ball.pos.y - ball.radius <= 0 || ball.pos.y + ball.radius >= CONFIG.CANVAS_HEIGHT) {
    ball.pos.y = Math.max(ball.radius, Math.min(CONFIG.CANVAS_HEIGHT - ball.radius, ball.pos.y));
    ball.vel.y *= -1;
  }

  // Left wall collision
  if (leftWallWidth > 0) {
    const leftRect = getWallRect('left', leftWallWidth);
    if (ballIntersectsRect(ball, leftRect) && ball.vel.x < 0) {
      ball.pos.x = leftRect.w + ball.radius;
      const mult = 1 + (leftWallWidth / CONFIG.MAX_WALL_WIDTH);
      ball.vel.x = Math.abs(ball.vel.x) * mult;
      ball.vel.y += (Math.random() - 0.5) * 200;
      ball.vel = clampSpeed(ball.vel);
    }
  }

  // Right wall collision
  if (rightWallWidth > 0) {
    const rightRect = getWallRect('right', rightWallWidth);
    if (ballIntersectsRect(ball, rightRect) && ball.vel.x > 0) {
      ball.pos.x = CONFIG.CANVAS_WIDTH - rightRect.w - ball.radius;
      const mult = 1 + (rightWallWidth / CONFIG.MAX_WALL_WIDTH);
      ball.vel.x = -Math.abs(ball.vel.x) * mult;
      ball.vel.y += (Math.random() - 0.5) * 200;
      ball.vel = clampSpeed(ball.vel);
    }
  }

  // Goal detection
  if (ball.pos.x + ball.radius < 0) return 'right';
  if (ball.pos.x - ball.radius > CONFIG.CANVAS_WIDTH) return 'left';

  return null;
}

function clampSpeed(vel) {
  const speed = vel.length();
  if (speed > CONFIG.BALL_MAX_SPEED) {
    return vel.normalize().scale(CONFIG.BALL_MAX_SPEED);
  }
  return vel;
}
```

---

### Task 3: Hand tracking integration — hands.js

**Files:**
- Create: `js/hands.js`

- [ ] **Step 1: Create the HandsController module**

```js
const HandsController = {
  detector: null,
  leftHand: null,
  rightHand: null,
  prevLeftWall: 0,
  prevRightWall: 0,

  async init() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const config = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      modelType: 'full',
    };
    this.detector = await handPoseDetection.createDetector(model, config);
  },

  async update(video) {
    if (!this.detector) return;
    const hands = await this.detector.estimateHands(video);
    this.leftHand = null;
    this.rightHand = null;
    for (const h of hands) {
      if (h.score < CONFIG.HAND_CONFIDENCE_MIN) continue;
      if (h.handedness === 'Left') this.leftHand = h;
      else this.rightHand = h;
    }
  },

  getWallWidth(hand) {
    if (!hand) return 0;
    const thumb = hand.keypoints[4];
    const index = hand.keypoints[8];
    const dx = thumb.x - index.x;
    const dy = thumb.y - index.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scaled = (dist / CONFIG.CANVAS_WIDTH) * CONFIG.MAX_WALL_WIDTH;
    return Math.min(scaled, CONFIG.MAX_WALL_WIDTH);
  },

  getLeftWallWidth() {
    const w = this.getWallWidth(this.leftHand);
    this.prevLeftWall = w > 0 ? w : this.prevLeftWall;
    return this.prevLeftWall;
  },

  getRightWallWidth() {
    const w = this.getWallWidth(this.rightHand);
    this.prevRightWall = w > 0 ? w : this.prevRightWall;
    return this.prevRightWall;
  },

  handsProximity() {
    if (!this.leftHand || !this.rightHand) return false;
    const wL = this.leftHand.keypoints[0];
    const wR = this.rightHand.keypoints[0];
    const dx = wL.x - wR.x;
    const dy = wL.y - wR.y;
    return Math.sqrt(dx * dx + dy * dy) < CONFIG.PROXIMITY_THRESHOLD;
  },

  isPinkyUp(hand) {
    if (!hand) return false;
    const mcp = hand.keypoints[17];
    const tip = hand.keypoints[20];
    return tip.y < mcp.y;
  },

  canLaunch() {
    return this.handsProximity() && this.isPinkyUp(this.rightHand);
  },
};
```

---

### Task 4: State machine — stateMachine.js

**Files:**
- Create: `js/stateMachine.js`

- [ ] **Step 1: Create StateMachine**

```js
const STATE = {
  IDLE: 'IDLE',
  LAUNCHED: 'LAUNCHED',
  GOAL: 'GOAL',
};

const StateMachine = {
  state: STATE.IDLE,
  goalTimer: 0,
  lastGoal: null,

  reset() {
    this.state = STATE.IDLE;
    this.goalTimer = 0;
    this.lastGoal = null;
  },

  update(dt, canLaunch) {
    switch (this.state) {
      case STATE.IDLE:
        if (canLaunch) {
          this.state = STATE.LAUNCHED;
          return 'launch';
        }
        break;
      case STATE.LAUNCHED:
        break;
      case STATE.GOAL:
        this.goalTimer -= dt * 1000;
        if (this.goalTimer <= 0) {
          this.state = STATE.IDLE;
          return 'reset';
        }
        break;
    }
    return null;
  },

  scoreGoal(side) {
    this.state = STATE.GOAL;
    this.goalTimer = CONFIG.GOAL_PAUSE_MS;
    this.lastGoal = side;
  },
};
```

---

### Task 5: Renderer — renderer.js

**Files:**
- Create: `js/renderer.js`

- [ ] **Step 1: Create the Renderer module**

```js
const Renderer = {
  ctx: null,
  goalFlash: 0,

  init(canvas) {
    this.ctx = canvas.getContext('2d');
  },

  clear() {
    this.ctx.fillStyle = CONFIG.BACKGROUND;
    this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
  },

  drawCenterLine() {
    const ctx = this.ctx;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CONFIG.CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
  },

  drawWall(side, width) {
    if (width <= 0) return;
    const ctx = this.ctx;
    ctx.fillStyle = side === 'left' ? CONFIG.NEON_CYAN : CONFIG.NEON_MAGENTA;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    if (side === 'left') {
      ctx.fillRect(0, 0, width, CONFIG.CANVAS_HEIGHT);
    } else {
      ctx.fillRect(CONFIG.CANVAS_WIDTH - width, 0, width, CONFIG.CANVAS_HEIGHT);
    }
    ctx.shadowBlur = 0;
  },

  drawBall(ball) {
    if (!ball.active) return;
    const ctx = this.ctx;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  },

  drawGoalFlash(side) {
    if (this.goalFlash <= 0) return;
    const ctx = this.ctx;
    ctx.fillStyle = side === 'left' ? CONFIG.NEON_CYAN : CONFIG.NEON_MAGENTA;
    ctx.globalAlpha = this.goalFlash;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    ctx.globalAlpha = 1;
    this.goalFlash -= 0.02;
  },

  triggerGoalFlash(side) {
    this.goalFlash = 0.3;
  },

  render(ball, leftWallWidth, rightWallWidth, score) {
    this.clear();
    this.drawCenterLine();
    this.drawWall('left', leftWallWidth);
    this.drawWall('right', rightWallWidth);
    this.drawBall(ball);
    this.drawGoalFlash();
    document.getElementById('score-left').textContent = score.left;
    document.getElementById('score-right').textContent = score.right;
  },
};
```

- [ ] **Step 2: Update status overlay in render.js**

Add to Renderer:

```js
  setStatus(text, visible = true) {
    const el = document.getElementById('status-overlay');
    el.textContent = text;
    el.classList.toggle('visible', visible);
  },

  setDebug(text) {
    document.getElementById('debug').textContent = text;
  },
```

---

### Task 6: AI opponent — ai.js

**Files:**
- Create: `js/ai.js`

- [ ] **Step 1: Create AI module**

```js
const AI = {
  reactionDelay: 0.3,
  timer: 0,
  targetWidth: 0,

  update(dt, ball, ballLaunched) {
    if (!ballLaunched) {
      this.targetWidth = CONFIG.MAX_WALL_WIDTH * 0.5;
      return this.targetWidth;
    }
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = this.reactionDelay * (1 + (1 - CONFIG.AI_DIFFICULTY));
      const distFromGoal = Math.abs(ball.pos.x - CONFIG.CANVAS_WIDTH);
      const maxDist = CONFIG.CANVAS_WIDTH;
      const urgency = 1 - (distFromGoal / maxDist);
      const noise = (Math.random() - 0.5) * 0.3;
      this.targetWidth = Math.max(20, (urgency + noise) * CONFIG.MAX_WALL_WIDTH * CONFIG.AI_DIFFICULTY);
    }
    return this.targetWidth;
  },
};
```

---

### Task 7: Game loop orchestration — game.js

**Files:**
- Create: `js/game.js`

- [ ] **Step 1: Create Game module**

```js
const Game = {
  ball: null,
  score: { left: 0, right: 0 },
  leftWallWidth: 0,
  rightWallWidth: 0,
  mode: '1p',
  running: false,
  lastTime: 0,

  init() {
    this.ball = new Ball();
    this.score = { left: 0, right: 0 };
    this.leftWallWidth = 0;
    this.rightWallWidth = 0;
    StateMachine.reset();
    Renderer.setStatus('READY');
    Renderer.setDebug('Bring hands close + raise pinky to launch');
  },

  setMode(mode) {
    this.mode = mode;
    this.init();
  },

  async frame(time) {
    if (!this.running) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    // Update hand tracking
    await HandsController.update(document.getElementById('video'));

    // Get wall widths
    this.leftWallWidth = HandsController.getLeftWallWidth();
    this.rightWallWidth = this.mode === '1p'
      ? AI.update(dt, this.ball, this.ball.active)
      : HandsController.getRightWallWidth();

    // State machine
    const action = StateMachine.update(dt, HandsController.canLaunch());
    if (action === 'launch') {
      this.ball.launch();
      Renderer.setStatus('', false);
    }
    if (action === 'reset') {
      this.ball = new Ball();
      Renderer.setStatus('READY');
    }

    // Physics
    this.ball.update(dt);
    const goal = handleCollisions(this.ball, this.leftWallWidth, this.rightWallWidth);
    if (goal) {
      this.score[goal]++;
      Renderer.triggerGoalFlash(goal);
      const label = goal === 'left' ? 'P2' : 'P1';
      Renderer.setStatus(`GOAL! ${label} scores!`);
      StateMachine.scoreGoal(goal);
    }

    // Render
    Renderer.render(this.ball, this.leftWallWidth, this.rightWallWidth, this.score);
    Renderer.setDebug(
      `Left wall: ${Math.round(this.leftWallWidth)}px | Right wall: ${Math.round(this.rightWallWidth)}px | Ball: ${this.ball.active ? 'active' : 'idle'}`
    );

    requestAnimationFrame((t) => this.frame(t));
  },
};
```

---

### Task 8: Boot sequence — main.js

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Create main entry point**

```js
(async function boot() {
  // Camera
  const video = document.createElement('video');
  video.id = 'video';
  video.style.display = 'none';
  video.width = CONFIG.CANVAS_WIDTH;
  video.height = CONFIG.CANVAS_HEIGHT;
  document.body.appendChild(video);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
  } catch (e) {
    Renderer.setDebug('Camera error: ' + e.message);
    return;
  }

  // Init renderer
  const canvas = document.getElementById('canvas');
  Renderer.init(canvas);

  // Init hands
  Renderer.setDebug('Loading hand model...');
  try {
    await HandsController.init();
  } catch (e) {
    Renderer.setDebug('Model load error: ' + e.message);
    return;
  }

  // Init game
  Game.init();

  // Mode buttons
  document.getElementById('mode-1p').addEventListener('click', () => {
    document.querySelectorAll('#controls button').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-1p').classList.add('active');
    Game.setMode('1p');
    Game.running = false;
    Game.running = true;
    Game.lastTime = performance.now();
    requestAnimationFrame((t) => Game.frame(t));
  });
  document.getElementById('mode-2p').addEventListener('click', () => {
    document.querySelectorAll('#controls button').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-2p').classList.add('active');
    Game.setMode('2p');
    Game.running = false;
    Game.running = true;
    Game.lastTime = performance.now();
    requestAnimationFrame((t) => Game.frame(t));
  });

  // Start game loop
  Game.running = true;
  Game.lastTime = performance.now();
  requestAnimationFrame((t) => Game.frame(t));
})();
```

---

## Tasks Summary

| Task | File(s) | Description |
|------|---------|-------------|
| 1 | `index.html`, `js/config.js` | Entry point, styles, constants |
| 2 | `js/physics.js` | Vec2, Ball, collision detection |
| 3 | `js/hands.js` | MediaPipe integration, wall width calc |
| 4 | `js/stateMachine.js` | Game state transitions |
| 5 | `js/renderer.js` | 80s retro canvas rendering |
| 6 | `js/ai.js` | CPU opponent |
| 7 | `js/game.js` | Frame orchestration |
| 8 | `js/main.js` | Boot sequence |
