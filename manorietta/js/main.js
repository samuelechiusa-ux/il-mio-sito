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
