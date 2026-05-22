const Checklist = (() => {
  const STORAGE_KEY = 'pasta-checklist';
  let overlay, grid, confirmBtn, confirmHandler, gridHandler;

  function init() {
    overlay = document.getElementById('checklist-overlay');
    grid = document.getElementById('checklist-grid');
    confirmBtn = document.getElementById('checklist-confirm');

    gridHandler = (e) => {
      const item = e.target.closest('.checklist-item');
      if (!item) return;
      item.classList.toggle('checked');
      saveState(getCheckedIds());
      playChime();
      updateConfirmBtn();
    };

    confirmHandler = () => {
      const checked = getCheckedIds();
      if (checked.length < 12) return;
      overlay.classList.remove('active');
      clearState();
    };

    grid.addEventListener('click', gridHandler);
    confirmBtn.addEventListener('click', confirmHandler);
  }

  function show() {
    if (!overlay) return;
    const saved = loadState();
    overlay.classList.add('active');
    if (saved && saved.length) {
      const items = grid.querySelectorAll('.checklist-item');
      const checkedSet = new Set(saved);
      items.forEach(item => {
        if (checkedSet.has(item.dataset.ingredient)) {
          item.classList.add('checked');
        }
      });
    }
    updateConfirmBtn();
  }

  function getCheckedIds() {
    return [...document.querySelectorAll('.checklist-item.checked')]
      .map(el => el.dataset.ingredient);
  }

  function updateConfirmBtn() {
    if (!confirmBtn) return;
    confirmBtn.disabled = getCheckedIds().length < 12;
  }

  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (_) {}
  }

  function saveState(ids) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch (_) {}
  }

  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (_) { return null; }
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  return { init, show };
})();
