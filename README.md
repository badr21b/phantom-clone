# Phantom-style WebGL Grid

A Three.js homage to the phantom.land homepage: an infinite, draggable wall
of project cards projected onto a curved, dome-like surface.

All card artwork and project names are original, procedurally generated
placeholders drawn to a canvas at runtime (`src/cards.js`) — no assets are
copied from the original site.

## How it works

- `src/cards.js` draws each project card (client, title, artwork, tag pills,
  year) onto an offscreen canvas that becomes a `CanvasTexture`.
- `src/main.js` lays the cards out in a staggered grid and wraps their
  positions modulo the grid size, so dragging in any direction loops forever.
- A custom vertex shader recesses vertices into the screen and pinches them
  inward based on their squared distance from the viewport centre, producing
  the fisheye/dome look. The fragment shader adds an edge vignette and a
  hover brighten.
- Pointer drag (with inertia), wheel/trackpad pan, hover picking via
  raycaster, plus a slow ambient drift.

## Run

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Drag or scroll to explore.
