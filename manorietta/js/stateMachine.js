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
