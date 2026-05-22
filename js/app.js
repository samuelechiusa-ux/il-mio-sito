const App = (() => {
  const state = {
    currentView: 'home',
    isOpen: false,
    currentProject: null
  };

  const homeTitle = document.getElementById('home-title');
  const homeSubtitle = document.getElementById('home-subtitle');
  const homeCredits = document.getElementById('home-credits');
  const homeView = document.getElementById('home-view');
  const detailView = document.getElementById('detail-view');
  const fullscreenOverlay = document.getElementById('fullscreen-overlay');
  const fullscreenIframe = document.getElementById('fullscreen-iframe');
  const previewIframe = document.getElementById('preview-iframe');
  const previewFrame = document.getElementById('preview-frame');
  const projectTitle = document.getElementById('project-title');
  const projectDescription = document.getElementById('project-description');
  const miniLogo = document.getElementById('mini-logo');
  const creditsView = document.getElementById('credits-view');
  const miniLogoCredits = document.getElementById('mini-logo-credits');

  function init() {
    Physics.init();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        homeTitle.classList.add('is-visible');
        setTimeout(() => {
          homeSubtitle.classList.add('is-visible');
        }, 600);
        setTimeout(() => {
          homeCredits.classList.add('is-visible');
        }, 900);
      });
    });

    homeTitle.addEventListener('click', toggleHome);
    homeCredits.addEventListener('click', openCredits);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (state.currentView === 'fullscreen' || state.currentView === 'credits')) {
        backToExpandedHome();
      }
    });

    previewFrame.addEventListener('click', openFullscreen);
    miniLogo.addEventListener('click', backToExpandedHome);
    miniLogoCredits.addEventListener('click', backToExpandedHome);

    window.addEventListener('resize', () => {
      Physics.updateDimensions();
    });
  }

  function toggleHome() {
    if (!state.isOpen) {
      openProjects();
    } else {
      closeProjects();
    }
  }

  function openProjects() {
    state.isOpen = true;

    homeSubtitle.classList.add('is-hidden');
    homeCredits.classList.add('is-hidden');

    setTimeout(() => {
      homeTitle.classList.add('is-open');
    }, 500);

    setTimeout(() => {
      Physics.loadShapes(PROJECTS, (project, el, body) => {
        navigateToProject(project, el, body);
      });
    }, 1500);
  }

  function closeProjects() {
    state.isOpen = false;
    homeTitle.classList.remove('is-open');
    Physics.clearShapes();
    setTimeout(() => {
      homeSubtitle.classList.remove('is-hidden');
      homeSubtitle.classList.add('is-visible');
      homeCredits.classList.remove('is-hidden');
      homeCredits.classList.add('is-visible');
    }, 300);
  }

  function openCredits() {
    if (state.isOpen) {
      homeTitle.classList.remove('is-open');
      Physics.clearShapes();
      state.isOpen = false;
    }

    homeView.style.opacity = '0';
    homeView.classList.remove('active');

    creditsView.classList.add('active');
    creditsView.style.opacity = '1';

    setupMiniLogo(miniLogoCredits);

    state.currentView = 'credits';
  }

  function navigateToProject(project, el) {
    state.currentProject = project;

    homeView.classList.remove('active');
    homeView.style.opacity = '0';

    Physics.clearShapes();

    const svgSize = Math.max(80, Math.min(window.innerWidth * 0.1, 140));
    const svgMini = 48;

    el.style.position = 'fixed';
    el.style.width = svgSize + 'px';
    el.style.height = svgSize + 'px';
    el.style.zIndex = '300';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.pointerEvents = 'none';
    el.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    document.body.appendChild(el);

    const endX = window.innerWidth - 60;
    const endY = 36;
    requestAnimationFrame(() => {
      el.style.left = endX + 'px';
      el.style.top = endY + 'px';
      el.style.width = svgMini + 'px';
      el.style.height = svgMini + 'px';
      el.style.transform = 'translate(-50%, -50%) rotate(720deg)';
    });

    setTimeout(() => {
      el.remove();
      showDetailView(project);
    }, 700);
  }

  function showDetailView(project) {
    setupMiniLogo(miniLogo);

    previewIframe.src = project.path;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;

    detailView.classList.add('active');
    detailView.style.opacity = '1';

    state.currentView = 'detail';

    let rotation = 0;
    const onScroll = () => {
      rotation += 0.3;
      miniLogo.style.transform = `rotate(${rotation}deg)`;
    };
    window.addEventListener('scroll', onScroll);
    miniLogo._scrollHandler = onScroll;
  }

  function setupMiniLogo(el) {
    el.innerHTML = '';
    el.style.display = 'block';
    const svgContent = SVGS['torna-indietro'];
    if (svgContent) {
      el.innerHTML = svgContent;
      const svgEl = el.querySelector('svg');
      if (svgEl) {
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.display = 'block';
        svgEl.style.pointerEvents = 'none';
      }
    }
  }

  function backToExpandedHome() {
    const wasFullscreen = state.currentView === 'fullscreen';

    if (wasFullscreen) {
      fullscreenOverlay.classList.remove('active');
      fullscreenIframe.src = '';
    }

    if (state.currentView === 'detail' || wasFullscreen) {
      detailView.style.opacity = '0';
      detailView.classList.remove('active');
      previewIframe.src = '';
      if (miniLogo._scrollHandler) {
        window.removeEventListener('scroll', miniLogo._scrollHandler);
      }
    }

    if (state.currentView === 'credits') {
      creditsView.style.opacity = '0';
      creditsView.classList.remove('active');
    }

    miniLogo.style.display = 'none';
    miniLogo.innerHTML = '';
    miniLogoCredits.style.display = 'none';
    miniLogoCredits.innerHTML = '';

    homeView.style.opacity = '1';
    homeView.classList.add('active');

    state.currentView = 'home';
    state.isOpen = false;

    openProjects();
  }

  function openFullscreen() {
    if (!state.currentProject) return;
    fullscreenIframe.src = state.currentProject.path;
    fullscreenOverlay.classList.add('active');
    state.currentView = 'fullscreen';
  }

  document.addEventListener('DOMContentLoaded', init);
  return { init, openProjects, closeProjects, backToExpandedHome };
})();
