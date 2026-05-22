(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    RecipeAudio.init();
    Gestures.init();
    Checklist.init();

    const appEl = document.getElementById('app');
    const finaleSection = document.getElementById('finale');
    const finalePlayBtn = document.getElementById('finale-play-btn');
    if (finalePlayBtn) finalePlayBtn.style.display = 'none';
    const progressBar = document.getElementById('progress-bar');
    const stepNavDots = document.querySelectorAll('.step-nav-dot');
    const allSections = document.querySelectorAll('.section');

    let firstInteraction = false;
    let finalePlayed = false;

    function onFirstInteraction() {
      if (firstInteraction) return;
      firstInteraction = true;
      RecipeAudio.unlock();
      Checklist.show();
    }

    function updateProgress() {
      if (!appEl || !progressBar) return;
      const scrollTop = appEl.scrollTop;
      const scrollHeight = appEl.scrollHeight - appEl.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';

      let activeStep = 0;
      allSections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4) {
          activeStep = i;
        }
      });

      stepNavDots.forEach((dot, i) => {
        const stepIndex = i + 2;
        dot.classList.toggle('active', stepIndex <= activeStep);
      });
    }

    function checkFinale() {
      if (finalePlayed) return;
      if (!finaleSection) return;
      const rect = finaleSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.4) {
        finalePlayed = true;
        RecipeAudio.playFinale();
        if (finalePlayBtn) {
          setTimeout(() => {
            finalePlayBtn.style.display = 'inline-block';
          }, 1500);
        }
      }
    }

    if (appEl) {
      appEl.addEventListener('scroll', () => {
        if (!firstInteraction) onFirstInteraction();
        updateProgress();
        checkFinale();
      }, { passive: true });

      appEl.addEventListener('touchstart', () => {
        if (!firstInteraction) onFirstInteraction();
      }, { passive: true });
    }

    if (finalePlayBtn) {
      finalePlayBtn.addEventListener('click', () => {
        RecipeAudio.playFinale();
      });
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    allSections.forEach(s => sectionObserver.observe(s));

    const step10 = document.getElementById('step-10');
    let timerInited = false;
    if (step10) {
      const timerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !timerInited) {
            timerInited = true;
            SmartTimer.init('timer-container');
            timerObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      timerObserver.observe(step10);
    }

    const step7 = document.getElementById('step-7');
    let cmInited = false;
    if (step7) {
      const cmObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !cmInited) {
            cmInited = true;
            ColorMatcher.init('color-matcher-container');
            cmObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      cmObserver.observe(step7);
    }
  });
})();
