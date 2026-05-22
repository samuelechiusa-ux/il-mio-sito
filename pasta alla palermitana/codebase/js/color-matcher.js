const ColorMatcher = (() => {
  const STOPS = [
    { pos: 0, label: 'Crudo', class: 'warning', color: '#F5F0E1' },
    { pos: 20, label: 'Iniziato', class: 'warning', color: '#E8C87A' },
    { pos: 40, label: 'Perfetto!', class: 'perfect', color: '#D4A843' },
    { pos: 60, label: 'Perfetto!', class: 'perfect', color: '#B8862C' },
    { pos: 75, label: 'Attenzione...', class: 'warning', color: '#8B6914' },
    { pos: 88, label: 'Bruciato!', class: 'danger', color: '#5C3D10' },
    { pos: 100, label: 'Bruciato!', class: 'danger', color: '#1A0F05' },
  ];

  function getStopAtPos(percent) {
    return STOPS.reduce((prev, curr) =>
      Math.abs(curr.pos - percent) < Math.abs(prev.pos - percent) ? curr : prev
    );
  }

  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="color-matcher">
        <p class="color-matcher-label">Confronta il colore del pangrattato</p>
        <div class="color-matcher-pan">
          <svg viewBox="0 0 120 60">
            <ellipse cx="60" cy="30" rx="50" ry="20" fill="none" stroke="var(--charcoal)" stroke-width="1.5" opacity="0.3"/>
            <ellipse cx="60" cy="30" rx="50" ry="20" fill="#F5F0E1" class="color-matcher-pan-fill" id="pan-fill" opacity="0.6"/>
            <path d="M10 30 Q10 10 60 10 Q110 10 110 30" fill="none" stroke="var(--charcoal)" stroke-width="2" opacity="0.3"/>
            <line x1="60" y1="10" x2="60" y2="5" stroke="var(--charcoal)" stroke-width="2" opacity="0.3"/>
          </svg>
        </div>
        <div class="color-matcher-track" id="color-track">
          <div class="color-matcher-thumb" id="color-thumb" style="left:0%"></div>
        </div>
        <p class="color-matcher-status" id="color-status">Crudo</p>
      </div>
    `;

    const track = document.getElementById('color-track');
    const thumb = document.getElementById('color-thumb');
    const status = document.getElementById('color-status');
    const panFill = document.getElementById('pan-fill');

    function setPosition(percent) {
      const clamped = Math.max(0, Math.min(100, percent));
      thumb.style.left = `${clamped}%`;
      const stop = getStopAtPos(clamped);
      status.textContent = stop.label;
      status.className = `color-matcher-status ${stop.class}`;
      panFill.setAttribute('fill', stop.color);
    }

    function handleMove(clientX) {
      const rect = track.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setPosition(percent);
    }

    track.addEventListener('mousedown', (e) => {
      handleMove(e.clientX);
      function onMove(ev) { handleMove(ev.clientX); }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    track.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    });

    track.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    });
  }

  return { init };
})();
