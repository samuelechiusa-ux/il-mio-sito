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
    const r = CONFIG.BALL_RADIUS;
    this.pos = new Vec2(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    this.prevPos = new Vec2(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    this.vel = new Vec2(0, 0);
    this.radius = r;
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
    this.prevPos = new Vec2(this.pos.x, this.pos.y);
    this.pos = this.pos.add(this.vel.scale(dt));
  }
}

function closestPointOnSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby;
  if (len2 < 1) return { x: ax, y: ay };
  const apx = px - ax;
  const apy = py - ay;
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / len2));
  return { x: ax + t * abx, y: ay + t * aby };
}

function segmentDistSq(ax, ay, bx, by, cx, cy, dx, dy) {
  const abx = bx - ax, aby = by - ay;
  const cdx = dx - cx, cdy = dy - cy;
  const acx = ax - cx, acy = ay - cy;

  const a = abx * abx + aby * aby;
  const b = abx * cdx + aby * cdy;
  const c = cdx * cdx + cdy * cdy;
  const d = abx * acx + aby * acy;
  const e = cdx * acx + cdy * acy;

  const det = a * c - b * b;

  let s, t;
  if (det < 1e-10) {
    s = 0;
    t = e / c;
    t = Math.max(0, Math.min(1, t));
  } else {
    s = (b * e - c * d) / det;
    t = (a * e - b * d) / det;

    if (s < 0) { s = 0; t = e / c; t = Math.max(0, Math.min(1, t)); }
    else if (s > 1) { s = 1; t = (e + b) / c; t = Math.max(0, Math.min(1, t)); }
    else if (t < 0) { t = 0; s = -d / a; s = Math.max(0, Math.min(1, s)); }
    else if (t > 1) { t = 1; s = (b - d) / a; s = Math.max(0, Math.min(1, s)); }
  }

  const px = ax + s * abx, py = ay + s * aby;
  const qx = cx + t * cdx, qy = cy + t * cdy;
  const rx = px - qx, ry = py - qy;
  return rx * rx + ry * ry;
}

function lineSegmentCollision(ball, p1, p2) {
  const dist2 = segmentDistSq(
    ball.prevPos.x, ball.prevPos.y, ball.pos.x, ball.pos.y,
    p1.x, p1.y, p2.x, p2.y
  );
  return dist2 < ball.radius * ball.radius;
}

function reflectOffSegment(ball, p1, p2, pinchDistance) {
  const closest = closestPointOnSegment(ball.pos.x, ball.pos.y, p1.x, p1.y, p2.x, p2.y);
  const dx = ball.pos.x - closest.x;
  const dy = ball.pos.y - closest.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let nx, ny;
  if (dist < 0.01) {
    const vLen = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);
    if (vLen < 0.01) return false;
    nx = -ball.vel.x / vLen;
    ny = -ball.vel.y / vLen;
  } else {
    nx = dx / dist;
    ny = dy / dist;
  }

  const vDotN = ball.vel.x * nx + ball.vel.y * ny;

  const speed = ball.vel.length();
  const mult = 1 + (pinchDistance / CONFIG.MAX_PINCH_DISTANCE);

  if (vDotN < 0) {
    const refX = ball.vel.x - 2 * vDotN * nx;
    const refY = ball.vel.y - 2 * vDotN * ny;
    const refLen = Math.sqrt(refX * refX + refY * refY);
    if (refLen > 0) {
      ball.vel.x = (refX / refLen) * speed * mult;
      ball.vel.y = (refY / refLen) * speed * mult;
    }
  }

  ball.pos.x = closest.x + nx * (ball.radius + 2);
  ball.pos.y = closest.y + ny * (ball.radius + 2);
  ball.vel = clampSpeed(ball.vel);

  return true;
}

function handleCollisions(ball, leftPaddle, rightPaddle) {
  if (!ball.active) return null;

  if (ball.pos.y - ball.radius <= 0 || ball.pos.y + ball.radius >= CONFIG.CANVAS_HEIGHT) {
    ball.pos.y = Math.max(ball.radius, Math.min(CONFIG.CANVAS_HEIGHT - ball.radius, ball.pos.y));
    ball.vel.y *= -1;
  }

  if (leftPaddle.detected && lineSegmentCollision(ball, leftPaddle.p1, leftPaddle.p2)) {
    const hit = reflectOffSegment(ball, leftPaddle.p1, leftPaddle.p2, leftPaddle.pinchDistance);
    if (hit) console.log('COLLISION: left paddle');
  }

  if (rightPaddle.detected && lineSegmentCollision(ball, rightPaddle.p1, rightPaddle.p2)) {
    const hit = reflectOffSegment(ball, rightPaddle.p1, rightPaddle.p2, rightPaddle.pinchDistance);
    if (hit) console.log('COLLISION: right paddle');
  }

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
