# Mouse-Oriented 3D Extrusion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 3D extrusion direction of each grid cell snap to one of four cardinal orientations based on which viewport quadrant the mouse cursor is in.

**Architecture:** Single-page HTML app. Add a `mousemove` listener on the grid element that determines the cursor's quadrant relative to viewport center and stores it as state. The render function reads this state to pick which of four geometric configurations to draw for each cell.

**Tech Stack:** Vanilla JS, inline SVG

---

### Task 1: Add mouse tracking and orientation state

**Files:**
- Modify: `index.html:105-113`

- [ ] **Step 1: Add orientation tracking variables and mousemove listener**

After the existing element references (line 109 `const grid = document.getElementById('grid');`), add:

```javascript
let orientation = 'top-right';

grid.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const left = e.clientX < cx;
  const top = e.clientY < cy;

  if (top && !left) orientation = 'top-right';
  else if (top && left) orientation = 'top-left';
  else if (!top && !left) orientation = 'bottom-right';
  else if (!top && left) orientation = 'bottom-left';

  render();
});
```

- [ ] **Step 2: Verify it works**

Open `index.html` in a browser, check the console for errors, and verify that moving the mouse triggers `render()` calls (add a temporary `console.log` in render if needed).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add mouse tracking for quadrant-based orientation"
```

---

### Task 2: Update render function with dynamic orientation

**Files:**
- Modify: `index.html:111-147`

- [ ] **Step 1: Update CSS classes for all panel directions**

Replace the three CSS classes with four (one per panel side):

```javascript
svg += `<style>
  .g-fill-window { fill: #c9c300; }
  .g-fill-vert { fill: #444; }
  .g-fill-horiz { fill: #777676; }
</style>`;
```

- [ ] **Step 2: Update the render function body**

Replace the loop body (lines 131-143) with orientation-aware logic:

```javascript
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = col * step;
    const y = row * step;

    let ix, iy;
    let panelA, panelAClass, panelB, panelBClass;

    switch (orientation) {
      case 'top-right':
        ix = x;
        iy = y + size - ins;
        panelA = `${ix},${iy} ${x},${y} ${x+size},${y} ${ix+ins},${iy}`;
        panelAClass = 'g-fill-vert';
        panelB = `${ix+ins},${iy} ${x+size},${y} ${x+size},${y+size} ${ix+ins},${iy+ins}`;
        panelBClass = 'g-fill-horiz';
        break;
      case 'top-left':
        ix = x + size - ins;
        iy = y + size - ins;
        panelA = `${ix},${iy} ${x},${y} ${x+size},${y} ${ix+ins},${iy}`;
        panelAClass = 'g-fill-vert';
        panelB = `${ix},${iy} ${x},${y} ${x},${y+size} ${ix},${iy+ins}`;
        panelBClass = 'g-fill-horiz';
        break;
      case 'bottom-right':
        ix = x;
        iy = y;
        panelA = `${ix},${iy+ins} ${x},${y+size} ${x+size},${y+size} ${ix+ins},${iy+ins}`;
        panelAClass = 'g-fill-vert';
        panelB = `${ix+ins},${iy} ${x+size},${y} ${x+size},${y+size} ${ix+ins},${iy+ins}`;
        panelBClass = 'g-fill-horiz';
        break;
      case 'bottom-left':
        ix = x + size - ins;
        iy = y;
        panelA = `${ix},${iy+ins} ${x},${y+size} ${x+size},${y+size} ${ix+ins},${iy+ins}`;
        panelAClass = 'g-fill-vert';
        panelB = `${ix},${iy} ${x},${y} ${x},${y+size} ${ix},${iy+ins}`;
        panelBClass = 'g-fill-horiz';
        break;
    }

    svg += `<rect class="g-fill-window" x="${ix}" y="${iy}" width="${ins}" height="${ins}"/>`;
    svg += `<polygon class="${panelAClass}" points="${panelA}"/>`;
    svg += `<polygon class="${panelBClass}" points="${panelB}"/>`;
  }
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html` and move the mouse between the four viewport quadrants. Verify the extrusion snaps to each orientation correctly.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: dynamic extrusion orientation follows mouse quadrant"
```

---

### Task 3: Edge case handling

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Handle mouse leaving the grid**

Add a `mouseleave` listener to freeze the last orientation instead of snapping to a default:

```javascript
grid.addEventListener('mouseleave', () => {
  render();
});
```

No change to orientation — the last known value persists.

- [ ] **Step 2: Handle initial load before mouse move**

The `orientation` variable defaults to `'top-right'`, so the grid renders correctly on first load.

- [ ] **Step 3: Verify edge cases**

Open `index.html`, verify the grid renders on load without mouse movement, and that moving the mouse out of the grid keeps the last orientation.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore: handle mouseleave and initial orientation edge cases"
```
