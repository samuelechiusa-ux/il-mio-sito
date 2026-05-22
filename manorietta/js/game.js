const Game = {
  ball: null,
  score: { left: 0, right: 0 },
  leftPaddle: null,
  rightPaddle: null,
  mode: '1p',
  running: false,
  lastTime: 0,

  init() {
    this.ball = new Ball();
    this.score = { left: 0, right: 0 };
    this.leftPaddle = { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 }, pinchDistance: 0, detected: false };
    this.rightPaddle = { p1: { x: CONFIG.CANVAS_WIDTH, y: 0 }, p2: { x: CONFIG.CANVAS_WIDTH, y: 0 }, pinchDistance: 0, detected: false };
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

    await HandsController.update(document.getElementById('video'));

    this.leftPaddle = HandsController.getLeftPaddle();
    this.rightPaddle = this.mode === '1p'
      ? AI.update(dt, this.ball, this.ball.active)
      : HandsController.getRightPaddle();

    const action = StateMachine.update(dt, HandsController.canLaunch());
    if (action === 'launch') {
      this.ball.launch();
      Renderer.setStatus('', false);
    }
    if (action === 'reset') {
      this.ball = new Ball();
      Renderer.setStatus('READY');
    }

    this.ball.update(dt);
    const goal = handleCollisions(this.ball, this.leftPaddle, this.rightPaddle);
    if (goal) {
      this.score[goal]++;
      Renderer.triggerGoalFlash();
      const label = goal === 'left' ? 'P2' : 'P1';
      Renderer.setStatus(`GOAL! ${label} scores!`);
      StateMachine.scoreGoal(goal);
    }

    Renderer.render(this.ball, this.leftPaddle, this.rightPaddle, this.score);
    Renderer.setDebug(
      `L: (${Math.round(this.leftPaddle.p1.x)},${Math.round(this.leftPaddle.p1.y)})-(${Math.round(this.leftPaddle.p2.x)},${Math.round(this.leftPaddle.p2.y)}) dist:${Math.round(this.leftPaddle.pinchDistance)} | R: (${Math.round(this.rightPaddle.p1.x)},${Math.round(this.rightPaddle.p1.y)})-(${Math.round(this.rightPaddle.p2.x)},${Math.round(this.rightPaddle.p2.y)}) dist:${Math.round(this.rightPaddle.pinchDistance)} | Ball: ${this.ball.active ? 'active' : 'idle'}`
    );

    requestAnimationFrame((t) => this.frame(t));
  },
};
