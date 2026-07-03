# Algérie — A Journey Through Cities

An immersive Three.js + GSAP travel experience through Algeria. Explore twelve cities on a curved, draggable WebGL wall — click any card to unfold a paper-style reveal with landmark details.

## Cities

Algiers · Constantine · Oran · Ghardaïa · Tipaza · Tamanrasset · Djanet · Tlemcen · Béjaïa · Batna · Timimoun · Annaba

Each card highlights the city's most famous landmark with procedurally drawn artwork.

## Stack

- **Three.js** — curved infinite grid, custom vertex shader (inner-sphere U-curve)
- **GSAP** — paper unfold/fold reveal animation on click
- **Canvas 2D** — runtime card textures (no external image assets)

## Run

```bash
npm install
npm run dev
```

Drag to explore the wall. Click a city card to unfold its travel note.
