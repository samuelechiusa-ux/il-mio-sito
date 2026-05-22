const Physics = (() => {
  let engine, world;
  let shapes = [];
  let container;
  let shapeContainer;
  let safeAreaBody;
  let wallBodies = [];
  let time = 0;
let mouseConstraint;

  function getSvgSize() {
    const vw = window.innerWidth;
    return Math.max(80, Math.min(vw * 0.1, 140));
  }

  function getSvgSizeMini() {
    return 48;
  }

  function init() {
    container = document.getElementById('physics-container');
    shapeContainer = document.getElementById('app');
    engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 }
    });
    world = engine.world;

    createWalls();
    createSafeArea();

    const mouse = Matter.Mouse.create(shapeContainer);
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.9,
        damping: 0.05,
        render: { visible: false }
      }
    });
    Matter.World.add(world, mouseConstraint);

    shapeContainer.addEventListener('touchstart', (e) => {
      if (e.target === container || e.target === shapeContainer) e.preventDefault();
    }, { passive: false });

    Matter.Events.on(engine, 'collisionStart', (event) => {
      const w2 = window.innerWidth;
      const h2 = window.innerHeight;
      event.pairs.forEach(pair => {
        if (pair.bodyA.label === 'safeArea' || pair.bodyB.label === 'safeArea') {
          const shape = pair.bodyA.label !== 'safeArea' ? pair.bodyA : pair.bodyB;
          const { x, y } = shape.position;
          const cx = w2 / 2, cy = h2 / 2;
          const dx = x - cx, dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 + 50) {
            const angle = Math.atan2(dy, dx);
            Matter.Body.setPosition(shape, {
              x: cx + Math.cos(angle) * 260,
              y: cy + Math.sin(angle) * 260
            });
          }
        }
      });
    });

    updateLoop();
  }

  function createWalls() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const wallOpts = { isStatic: true, restitution: 0.8, friction: 0.1 };

    wallBodies.forEach(b => Matter.World.remove(world, b));
    wallBodies = [];

    const walls = [
      Matter.Bodies.rectangle(w / 2, -25, w, 50, wallOpts),
      Matter.Bodies.rectangle(w / 2, h + 25, w, 50, wallOpts),
      Matter.Bodies.rectangle(-25, h / 2, 50, h, wallOpts),
      Matter.Bodies.rectangle(w + 25, h / 2, 50, h, wallOpts)
    ];
    wallBodies = walls;
    Matter.World.add(world, walls);
  }

  function createSafeArea() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    safeAreaBody = Matter.Bodies.circle(w / 2, h / 2, 200, {
      isStatic: true,
      restitution: 0.8,
      label: 'safeArea'
    });
    Matter.World.add(world, safeAreaBody);
  }

  function updateLoop() {
    time += 1 / 60;

    shapes.forEach(shape => {
      const phase = shape.driftPhase;
      const speed = shape.driftSpeed;
      const forceMag = 0.0002;
      const fx = Math.sin(time * speed + phase) * forceMag;
      const fy = Math.cos(time * speed * 0.7 + phase * 0.5) * forceMag;
      Matter.Body.applyForce(shape.body, shape.body.position, { x: fx, y: fy });
    });

    Matter.Engine.update(engine, 1000 / 60);

    shapes.forEach(shape => {
      const el = shape.element;
      if (el) {
        const { x, y } = shape.body.position;
        const angle = shape.body.angle;
        const scale = el._hovered ? 1.08 : 1;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}rad) scale(${scale})`;
      }
    });
    requestAnimationFrame(updateLoop);
  }

  function loadShapes(projectList, onShapeClick) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const svgSize = getSvgSize();

    shapes.forEach(s => {
      if (s.element && s.element.parentNode) s.element.remove();
    });
    shapes = [];

    createWalls();

    projectList.forEach((project, i) => {
      const el = document.createElement('div');
      el.className = 'svg-shape';
      el.style.position = 'absolute';
      el.style.width = svgSize + 'px';
      el.style.height = svgSize + 'px';
      el.style.zIndex = '20';
      el.style.pointerEvents = 'auto';
      el.style.left = '0';
      el.style.top = '0';

      const angle = (2 * Math.PI / projectList.length) * i + (Math.random() - 0.5) * 0.3;
      const radius = Math.min(w, h) * 0.25;
      const cx = w / 2, cy = h / 2;
      const startX = cx + Math.cos(angle) * radius;
      const startY = cy + Math.sin(angle) * radius;

      const body = Matter.Bodies.circle(startX, startY, 40, {
        restitution: 0.8,
        friction: 0.05,
        frictionAir: 0.02,
        density: 0.002
      });
      body.label = project.id;

      el.projectId = project.id;
      el.addEventListener('mouseenter', () => { el._hovered = true; });
      el.addEventListener('mouseleave', () => { el._hovered = false; });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onShapeClick(project, el, body);
      });

      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 0 0 2px ' + project.color;
      el.style.transform = `translate(-50%, -50%) translate(${startX}px, ${startY}px) rotate(0rad)`;
      shapeContainer.appendChild(el);
      Matter.World.add(world, body);

      const svgContent = SVGS[project.id];
      if (svgContent) {
        el.innerHTML = svgContent;
        el.style.borderRadius = '0';
        el.style.boxShadow = 'none';
        const svgEl = el.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = '100%';
          svgEl.style.display = 'block';
          svgEl.style.pointerEvents = 'none';
        }
      }

      requestAnimationFrame(() => {
        el.classList.add('is-visible');
      });

      shapes.push({
        element: el,
        body,
        project,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 1.0 + Math.random() * 0.8
      });
    });

    return shapes;
  }

  function clearShapes() {
    shapes.forEach(s => {
      if (s.element && s.element.parentNode) s.element.remove();
      Matter.World.remove(world, s.body);
    });
    shapes = [];
  }

  function updateDimensions() {
    createWalls();
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (safeAreaBody) {
      Matter.Body.setPosition(safeAreaBody, { x: w / 2, y: h / 2 });
    }
  }

  return { init, loadShapes, clearShapes, updateDimensions };
})();
