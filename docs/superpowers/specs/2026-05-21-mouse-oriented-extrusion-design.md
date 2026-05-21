# Mouse-Oriented 3D Extrusion for Grid Shapes

## Summary

Interactive grid of 3D window shapes where the extrusion direction tracks the mouse cursor, snapping to four quadrants defined by the viewport center.

## Mouse Tracking

- A `mousemove` listener on the grid element tracks cursor position
- The viewport is divided into 4 quadrants using the viewport center as origin
- On each mouse move, the current quadrant is determined
- If the quadrant changes, a re-render is triggered

## Quadrant Mapping

| Cursor quadrant | Yellow square position | Panels visible |
|-----------------|----------------------|----------------|
| top-right       | bottom-left          | top + right    |
| top-left        | bottom-right         | top + left     |
| bottom-right    | top-left             | bottom + right |
| bottom-left     | top-right            | bottom + left  |

## Per-Cell Geometry

For a cell at (x, y) with outer size `s` and inner size `ins`:

| Orientation | ix (inner x) | iy (inner y) | Panel 1 | Panel 2 |
|-------------|-------------|-------------|---------|---------|
| bottom-left inner | `x` | `y + s - ins` | top | right |
| bottom-right inner | `x + s - ins` | `y + s - ins` | top | left |
| top-left inner | `x` | `y` | bottom | right |
| top-right inner | `x + s - ins` | `y` | bottom | left |

### Panel vertex formulas

- **Top**: `(ix,iy) → (x,y) → (x+s,y) → (ix+ins,iy)`
- **Bottom**: `(ix,iy+ins) → (x,y+s) → (x+s,y+s) → (ix+ins,iy+ins)`
- **Right**: `(ix+ins,iy) → (x+s,y) → (x+s,y+s) → (ix+ins,iy+ins)`
- **Left**: `(ix,iy) → (x,y) → (x,y+s) → (ix,iy+ins)`

## Colors

- Vertical panels (top/bottom): `#444` (dark gray)
- Horizontal panels (left/right): `#777676` (medium gray)
- Inner window (yellow square): `#c9c300`

## Edge Cases

- Cursor on center boundary: maintain last known orientation
- No mouse movement yet (initial load): default to top-right quadrant (current behavior)
- Mouse leaves the viewport: maintain last orientation
- Resize: recalculate viewport center on next mousemove

## Files to Modify

- `index.html` — add mousemove listener, update render function with orientation parameter

## Controls (unchanged)

- Inner size slider
- Spacing slider
- Density slider
