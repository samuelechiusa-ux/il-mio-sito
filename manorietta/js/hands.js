const HandsController = {
  detector: null,
  leftHand: null,
  rightHand: null,
  prevLeftPaddle: null,
  prevRightPaddle: null,
  scaleX: 1,
  scaleY: 1,

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
    if (video.videoWidth > 0) {
      this.scaleX = CONFIG.CANVAS_WIDTH / video.videoWidth;
      this.scaleY = CONFIG.CANVAS_HEIGHT / video.videoHeight;
    }
    for (const h of hands) {
      if (h.score < CONFIG.HAND_CONFIDENCE_MIN) continue;
      if (h.handedness === 'Left') this.leftHand = h;
      else this.rightHand = h;
    }
  },

  getPaddleData(hand) {
    if (!hand) return null;
    const thumb = hand.keypoints[4];
    const index = hand.keypoints[8];
    const sx = this.scaleX;
    const sy = this.scaleY;
    const px = CONFIG.CANVAS_WIDTH - thumb.x * sx;
    const py = thumb.y * sy;
    const ix = CONFIG.CANVAS_WIDTH - index.x * sx;
    const iy = index.y * sy;
    const dx = px - ix;
    const dy = py - iy;
    return {
      p1: { x: px, y: py },
      p2: { x: ix, y: iy },
      pinchDistance: Math.sqrt(dx * dx + dy * dy),
      detected: true,
    };
  },

  getLeftPaddle() {
    const data = this.getPaddleData(this.leftHand);
    if (data) {
      this.prevLeftPaddle = data;
      return data;
    }
    return this.prevLeftPaddle || { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 }, pinchDistance: 0, detected: false };
  },

  getRightPaddle() {
    const data = this.getPaddleData(this.rightHand);
    if (data) {
      this.prevRightPaddle = data;
      return data;
    }
    return this.prevRightPaddle || { p1: { x: CONFIG.CANVAS_WIDTH, y: 0 }, p2: { x: CONFIG.CANVAS_WIDTH, y: 0 }, pinchDistance: 0, detected: false };
  },

  handsProximity() {
    if (!this.leftHand || !this.rightHand) return false;
    const wL = this.leftHand.keypoints[0];
    const wR = this.rightHand.keypoints[0];
    const dx = (wL.x - wR.x) * this.scaleX;
    const dy = (wL.y - wR.y) * this.scaleY;
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
