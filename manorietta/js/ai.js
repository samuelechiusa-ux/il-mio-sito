const AI = {
  reactionDelay: 0.3,
  timer: 0,
  centerY: CONFIG.CANVAS_HEIGHT / 2,
  targetPinch: 0,

  update(dt, ball, ballLaunched) {
    const edgeX = CONFIG.CANVAS_WIDTH - 40;

    if (!ballLaunched) {
      this.centerY = CONFIG.CANVAS_HEIGHT / 2;
      this.targetPinch = 80;
    } else {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.timer = this.reactionDelay * (1 + (1 - CONFIG.AI_DIFFICULTY));
        const distFromGoal = Math.abs(ball.pos.x - CONFIG.CANVAS_WIDTH);
        const urgency = 1 - (distFromGoal / CONFIG.CANVAS_WIDTH);
        const noise = (Math.random() - 0.5) * 40;
        this.centerY += (ball.pos.y - this.centerY) * CONFIG.AI_DIFFICULTY * 0.05;
        this.centerY += noise * dt;
        this.targetPinch = Math.max(30, urgency * CONFIG.MAX_PINCH_DISTANCE * CONFIG.AI_DIFFICULTY);
      }
    }

    this.centerY = Math.max(30, Math.min(CONFIG.CANVAS_HEIGHT - 30, this.centerY));

    const halfPinch = this.targetPinch / 2;
    return {
      p1: { x: edgeX, y: this.centerY - halfPinch },
      p2: { x: edgeX, y: this.centerY + halfPinch },
      pinchDistance: this.targetPinch,
      detected: true,
    };
  },
};
