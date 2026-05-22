const RecipeAudio = (() => {
  let audioCtx = null;
  let audioBuffer = null;
  let readyPromise = null;
  let isReady = false;

  function init() {
  }

  function unlock() {
    if (audioCtx && audioCtx.state !== 'closed') return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.resume();
      readyPromise = fetchAndDecode();
    } catch (_) {}
  }

  async function fetchAndDecode() {
    try {
      const response = await fetch('assets/audio/minchia-bravo.m4a');
      if (!response.ok) throw new Error('File not found');
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await new Promise((resolve, reject) => {
        audioCtx.decodeAudioData(arrayBuffer, resolve, reject);
      });
      isReady = true;
    } catch (_) {
      isReady = false;
    }
  }

  async function playFinale() {
    if (!audioCtx) return;
    try {
      if (readyPromise) await readyPromise;
      if (!audioBuffer) return;
      await audioCtx.resume();
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start(0);
    } catch (_) {}
  }

  return { init, unlock, playFinale };
})();
