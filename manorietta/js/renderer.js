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

  drawPaddle(side, paddle) {
    if (!paddle.detected) return;
    const ctx = this.ctx;
    const color = side === 'left' ? CONFIG.NEON_CYAN : CONFIG.NEON_MAGENTA;

    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(paddle.p1.x, paddle.p1.y);
    ctx.lineTo(paddle.p2.x, paddle.p2.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.shadowBlur = 30;

    ctx.beginPath();
    ctx.arc(paddle.p1.x, paddle.p1.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(paddle.p2.x, paddle.p2.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(paddle.p1.x, paddle.p1.y, 18, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(paddle.p2.x, paddle.p2.y, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = '10px Courier New';
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.fillText(`${Math.round(paddle.p1.x)},${Math.round(paddle.p1.y)}`, paddle.p1.x + 10, paddle.p1.y - 5);
    ctx.fillText(`${Math.round(paddle.p2.x)},${Math.round(paddle.p2.y)}`, paddle.p2.x + 10, paddle.p2.y - 5);
    ctx.globalAlpha = 1;

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

  drawGoalFlash() {
    if (this.goalFlash <= 0) return;
    const ctx = this.ctx;
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = this.goalFlash;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    ctx.globalAlpha = 1;
    this.goalFlash -= 0.02;
  },

  triggerGoalFlash() {
    this.goalFlash = 0.3;
  },

  setStatus(text, visible = true) {
    const el = document.getElementById('status-overlay');
    el.textContent = text;
    el.classList.toggle('visible', visible);
  },

  setDebug(text) {
    document.getElementById('debug').textContent = text;
  },

  render(ball, leftPaddle, rightPaddle, score) {
    this.clear();
    this.drawCenterLine();
    this.drawPaddle('left', leftPaddle);
    this.drawPaddle('right', rightPaddle);
    this.drawBall(ball);
    this.drawGoalFlash();
    document.getElementById('score-left').textContent = score.left;
    document.getElementById('score-right').textContent = score.right;
  },
};
