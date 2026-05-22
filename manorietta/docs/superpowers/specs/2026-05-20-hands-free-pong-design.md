# Hands-Free Pong — Design Spec

**Date:** 2026-05-20
**Runtime:** `@tensorflow-models/hand-pose-detection` with MediaPipe
**Rendering:** HTML5 Canvas (native API)

## Overview

A two-player (human vs human or human vs CPU) Pong variant where each player controls a wall with their hand. The wall's width is proportional to the thumb-index finger distance. The ball bounces off top/bottom canvas edges; the left/right edges are goals. Each wall defends its goal by extending horizontally from the edge toward center.

## Architecture

```
index.html
src/
├── main.js           Boot: camera init, detector creation, game loop start
├── game.js           requestAnimationFrame loop, deltaTime orchestration
├── physics.js        Vec2 class, AABB collision, bounce logic
├── hands.js          MediaPipe integration, distance calculations
├── stateMachine.js   Game state transitions
├── renderer.js       Canvas drawing (80s retro aesthetic)
├── ai.js             CPU opponent logic
└── config.js         Constants: thresholds, sizes, speeds, tuning knobs
```

### Data flow

```
Camera feed
  └─► hands.js (MediaPipe detection, every frame)
        └─► game.js
              ├─► stateMachine.js (ball spawn / goal / reset)
              ├─► physics.js (ball movement + collision)
              └─► renderer.js (draw walls, ball, score, background)
```

## Game States

```
STATE_IDLE ──► STATE_LAUNCHED ──► GOAL_SCORED ──► STATE_IDLE
```

- **STATE_IDLE:** Ball is static at center. Only hand tracking active. Waits for launch gesture (Condition A && Condition B).
- **STATE_LAUNCHED:** Ball moves with physics. Collision detection active. Both walls active.
- **GOAL_SCORED:** Ball frozen for 1.5s. Scoreboard updates visually. Then auto-resets to STATE_IDLE.

## Hand Tracking

### Keypoints used (MediaPipe 21-keypoint model)

| Keypoint | Name | Use |
|----------|------|-----|
| 0 | Wrist | Hands proximity (Condition A) |
| 4 | Thumb Tip | Paddle width (left wall) |
| 8 | Index Finger Tip | Paddle width (right wall) |
| 17 | Pinky MCP | Pinky extension (Condition B) |
| 20 | Pinky Tip | Pinky extension (Condition B) |

### Paddle width calculation

```
function paddleWidth(thumb, index):
    return dist(thumb, index)
    // scaled proportionally to canvas width
    // w = 0 → no wall   w = max → wall spans half canvas
```

### Launch gesture (Condition A && Condition B)

```
Condition A (hands proximity):
    dist(wristL, wristR) < PROXIMITY_THRESHOLD

Condition B (pinky extended):
    pinkyTip.y < pinkyMCP.y
    // y decreases upward in canvas space

Launch when A && B both true.
```

## Physics

### Ball

```
ball.pos += ball.vel * deltaTime

// Top/bottom bounce (invert Y)
if ball touches top or bottom edge:
    ball.vel.y *= -1

// Wall collision (AABB: ball vs wall rect)
if ball collides with left wall:
    ball.vel.x = abs(ball.vel.x)     // redirect right
    ball.vel.y += random(-0.3, +0.3) // random vertical component
    ball.vel *= 1 + (wallWidth / maxWidth) // velocity multiplier (wider wall = stronger bounce)

if ball collides with right wall:
    same logic, mirrored

// Goal detection
if ball.pos.x < 0:         goal for right player
if ball.pos.x > canvas.width: goal for left player
```

### Velocity Multiplier

When the ball hits a wall, its speed is multiplied by `1 + (wallWidth / maxWallWidth)`. This means a wide wall (fingers spread wide) sends the ball flying back harder — rewarding defense with offensive counterplay.

```
velocityMultiplier = 1 + (currentWallWidth / MAX_WALL_WIDTH)
// Range: 1.0 (fingers together) to ~2.0 (fingers fully spread)
// Caps at maxWallWidth to prevent infinite multiplication
```

### Ball spawn

The ball spawns from the center of the canvas toward a random direction (random initial angle but always with horizontal component so it doesn't go straight vertical).

## Rendering — 80s Retro Aesthetic

- **Background:** Dark/black (#0a0a0a or similar deep color)
- **Walls:** Neon-colored rectangles — cyan for left, magenta for right
- **Ball:** Small bright white rectangle or circle with slight glow
- **Score display:** Large pixel-style digits at top center
- **Goal line:** Dashed vertical line at center
- **Particles:** Optional — small particle burst on wall collision
- **Font:** Use a monospace or retro bitmap-style font
- **Scanlines:** Optional CSS overlay on the canvas element for CRT feel

## AI (CPU Player)

The CPU opponent controls the opposite wall. Simple heuristic:
- Track the ball's Y position
- Adjust wall width proportionally to ball's proximity to the goal
- Add slight reaction delay and noise to simulate human imperfection (difficulty tuning knob in config.js)

## UI Overlay (HTML/CSS, not canvas)

- **Score display** — positioned above canvas with CSS
- **State indicator** — "READY" / "LAUNCH" / "GOAL!" overlay text
- **Mode selector** — 1P (vs CPU) / 2P (vs human) toggle
- **Camera preview** — small PiP showing camera feed (debug positioning)

## Multiplayer Mode

- **1P Mode:** Left hand = human, right wall = CPU
- **2P Mode:** Left hand = player 1, right hand = player 2
- The mode is selected before the game starts via a simple pre-game screen

## Project Setup

```
npm init -y
npm install @tensorflow-models/hand-pose-detection @mediapipe/hands
# No other dependencies. Canvas is native.
```

Use a simple bundler (e.g., esbuild or vite) configured for single-page app with WebWorker/mediapipe compatibility.

## Configuration Constants (config.js)

```js
export const CONFIG = {
  // hand proximity threshold (pixels in image space)
  PROXIMITY_THRESHOLD: 100,
  // max wall width as fraction of canvas width
  MAX_WALL_WIDTH_FRACTION: 0.5,
  // ball physics
  BALL_RADIUS: 8,
  BALL_INITIAL_SPEED: 300, // px/s
  BALL_MAX_SPEED: 800,     // px/s
  // game
  GOAL_PAUSE_MS: 1500,
  // AI difficulty [0..1]
  AI_DIFFICULTY: 0.7,
  // canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  // visuals
  NEON_CYAN: '#00ffff',
  NEON_MAGENTA: '#ff00ff',
  BACKGROUND: '#0a0a0a',
}
```

## Error Handling

- **Camera unavailable:** Show a clear error message, fall back to mouse controls for testing
- **No hand detected:** Keep wall at default (minimal) width, don't crash
- **Low confidence (< 0.5):** Ignore the frame's hand data, reuse previous wall state
- **MediaPipe failure:** Console error + retry detector creation up to 3 times

## Testing Strategy

- Unit tests for physics.js (collision, bounce, velocity multiplier)
- Unit tests for stateMachine.js (state transitions)
- Unit tests for hands.js (distance calculations with mock keypoints)
- Manual testing via the demo page with camera

## Future (not in scope for v1)

- Audio feedback (retro beeps on collision/goal)
- Advanced AI with prediction
- Leaderboard / local storage scores
- Full-screen mode
