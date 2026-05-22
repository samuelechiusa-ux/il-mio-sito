const SmartTimer = (() => {
  let state = {
    inputMinutes: 10,
    remainingSeconds: 0,
    isRunning: false,
    intervalId: null,
    waterAlertShown: false,
  };

  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="timer-container">
        <div class="timer-input-group">
          <button class="timer-btn" id="timer-minus">&minus;</button>
          <input type="number" class="timer-input" id="timer-input" value="10" min="1" max="30">
          <button class="timer-btn" id="timer-plus">+</button>
        </div>
        <p class="timer-label">Tempo sulla confezione (minuti)</p>
        <div class="timer-display" id="timer-display">10:00</div>
        <svg class="timer-progress-ring" id="timer-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--terracotta-light)" stroke-width="6"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--amber)" stroke-width="6"
            stroke-dasharray="326.7" stroke-dashoffset="0" stroke-linecap="round"
            transform="rotate(-90 60 60)" id="timer-ring-progress"/>
        </svg>
        <div class="timer-controls">
          <button class="btn-primary" id="timer-start">Avvia timer</button>
          <button class="btn-primary" id="timer-reset" style="background:var(--warm-gray);display:none">Annulla</button>
        </div>
      </div>
      <div class="timer-water-alert" id="timer-water-alert">
        <p>Salva un mestolo di acqua di cottura!</p>
        <button class="btn-primary" id="timer-water-dismiss">Fatto!</button>
      </div>
    `;

    const input = document.getElementById('timer-input');
    const minusBtn = document.getElementById('timer-minus');
    const plusBtn = document.getElementById('timer-plus');
    const startBtn = document.getElementById('timer-start');
    const resetBtn = document.getElementById('timer-reset');
    const display = document.getElementById('timer-display');
    const ring = document.getElementById('timer-ring');
    const ringProgress = document.getElementById('timer-ring-progress');
    const waterAlert = document.getElementById('timer-water-alert');
    const waterDismiss = document.getElementById('timer-water-dismiss');

    function getAdjustedSeconds(minutes) {
      const adjusted = Math.max(1, minutes - 2);
      return adjusted * 60;
    }

    function updateDisplay(seconds) {
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      display.textContent = `${m}:${s}`;
    }

    function updateRing(remaining, total) {
      const offset = total > 0 ? 326.7 * (1 - remaining / total) : 0;
      ringProgress.setAttribute('stroke-dashoffset', offset);
    }

    function showTimer() {
      display.style.display = 'block';
      ring.style.display = 'block';
    }

    function hideInput() {
      const group = container.querySelector('.timer-input-group');
      const label = container.querySelector('.timer-label');
      if (group) group.style.display = 'none';
      if (label) label.style.display = 'none';
    }

    function showInput() {
      const group = container.querySelector('.timer-input-group');
      const label = container.querySelector('.timer-label');
      if (group) group.style.display = 'flex';
      if (label) label.style.display = 'block';
      display.style.display = 'none';
      ring.style.display = 'none';
      waterAlert.classList.remove('active');
    }

    function startTimer() {
      if (state.isRunning) return;
      const raw = parseInt(input.value, 10);
      if (isNaN(raw) || raw < 1) {
        input.value = 10;
        return;
      }
      state.inputMinutes = raw;
      state.remainingSeconds = getAdjustedSeconds(raw);
      state.isRunning = true;
      state.waterAlertShown = false;
      hideInput();
      showTimer();
      updateDisplay(state.remainingSeconds);
      updateRing(state.remainingSeconds, state.remainingSeconds);
      startBtn.textContent = 'In corso...';
      startBtn.style.background = 'var(--success-green)';
      resetBtn.style.display = 'inline-block';

      state.intervalId = setInterval(() => {
        state.remainingSeconds--;
        updateDisplay(state.remainingSeconds);
        updateRing(state.remainingSeconds, getAdjustedSeconds(state.inputMinutes));

        if (!state.waterAlertShown && state.remainingSeconds <= 30 && state.remainingSeconds > 0) {
          state.waterAlertShown = true;
          waterAlert.classList.add('active');
          playWaterChime();
        }

        if (state.remainingSeconds <= 0) {
          clearInterval(state.intervalId);
          state.isRunning = false;
          display.textContent = '00:00';
          startBtn.textContent = 'Completato!';
        }
      }, 1000);
    }

    function resetTimer() {
      if (state.intervalId) clearInterval(state.intervalId);
      state.isRunning = false;
      state.remainingSeconds = 0;
      state.waterAlertShown = false;
      showInput();
      startBtn.textContent = 'Avvia timer';
      startBtn.style.background = '';
      resetBtn.style.display = 'none';
      display.textContent = '00:00';
    }

    function playWaterChime() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.value = 880;
          gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.2);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc2.start(ctx.currentTime + 0.2);
          osc2.stop(ctx.currentTime + 0.35);
        }, 200);
      } catch (_) {}
    }

    minusBtn.addEventListener('click', () => {
      const val = parseInt(input.value, 10);
      if (val > 1) input.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
      const val = parseInt(input.value, 10);
      if (val < 30) input.value = val + 1;
    });

    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);

    waterDismiss.addEventListener('click', () => {
      waterAlert.classList.remove('active');
    });
  }

  return { init };
})();
