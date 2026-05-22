const Gestures = (() => {
  let startX = 0;
  let startY = 0;

  function init() {
    const app = document.getElementById('app');
    let isScrolling = false;

    app.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    app.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (isScrolling) return;
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 500);

        const sections = [...document.querySelectorAll('.section')];
        const sectionHeight = window.innerHeight;
        const currentIndex = Math.round(app.scrollTop / sectionHeight);

        if (diffX < 0 && currentIndex < sections.length - 1) {
          sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (diffX > 0 && currentIndex > 0) {
          sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, { passive: true });
  }

  return { init };
})();
