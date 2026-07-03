import * as THREE from "three";
import { buildCardCanvases, CARD_ASPECT } from "./cards.js";

// ---------------------------------------------------------------------------
// An homage to the phantom.land homepage: an infinite, draggable grid of
// project cards projected onto a gently curved (dome-like) surface.
// All artwork is generated procedurally in cards.js.
// ---------------------------------------------------------------------------

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0a0a0a, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 10;

// --- grid layout ------------------------------------------------------------

const CARD_H = 3.0;
const CARD_W = CARD_H * CARD_ASPECT;
const GAP = 0.35;
const CELL_X = CARD_W + GAP;
const CELL_Y = CARD_H + GAP;
const COLS = 5; // virtual columns before wrapping
const ROWS = 4; // virtual rows before wrapping
const WRAP_W = COLS * CELL_X;
const WRAP_H = ROWS * CELL_Y;

// Concave curvature: camera inside a sphere. Uses a true spherical cap so the
// wall forms a pronounced U — centre sits deepest, edges bow toward the viewer.
const vertexShader = /* glsl */ `
  uniform float uRadius;    // sphere radius (smaller = tighter U)
  uniform float uCurve;     // depth multiplier
  uniform float uPinch;     // horizontal wrap strength
  uniform float uScale;     // hover scale
  varying vec2 vUv;
  varying float vFade;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position * uScale, 1.0);

    float d2 = dot(wp.xy, wp.xy);
    float R = uRadius;
    // inner-sphere cap: smooth U-bow from centre (flat) to edges (forward)
    float zBow = R - sqrt(max(R * R - d2, 0.0001));
    wp.z += zBow * uCurve;
    // pinch xy as we climb the sphere wall
    wp.xy *= 1.0 - (zBow / R) * uPinch;

    vFade = smoothstep(38.0, 2.5, d2);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHover;
  varying vec2 vUv;
  varying float vFade;

  void main() {
    vec3 tex = texture2D(uMap, vUv).rgb;
    tex *= 0.72 + 0.28 * vFade;      // vignette toward edges of the dome
    tex *= 1.0 + uHover * 0.18;      // brighten on hover
    gl_FragColor = vec4(tex, 1.0);
  }
`;

const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 24, 24);
const textures = buildCardCanvases().map((c) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
});

const cards = [];
let idx = 0;
for (let col = 0; col < COLS; col++) {
  for (let row = 0; row < ROWS; row++) {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMap: { value: textures[idx % textures.length] },
        uRadius: { value: 9.5 },
        uCurve: { value: 1.35 },
        uPinch: { value: 0.42 },
        uScale: { value: 1 },
        uHover: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    // brick-like offset: stagger every other column vertically
    const baseX = col * CELL_X;
    const baseY = row * CELL_Y + (col % 2 ? CELL_Y * 0.5 : 0);
    mesh.userData = { baseX, baseY, hover: 0 };
    scene.add(mesh);
    cards.push(mesh);
    idx++;
  }
}

// --- drag / inertia ----------------------------------------------------------

const offset = new THREE.Vector2(0, 0);
const velocity = new THREE.Vector2(0, 0);
let dragging = false;
const last = new THREE.Vector2();
let pxToWorld = 0.01;

function updatePxToWorld() {
  const vFov = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFov / 2) * camera.position.z;
  pxToWorld = height / window.innerHeight;
}

canvas.addEventListener("pointerdown", (e) => {
  dragging = true;
  canvas.classList.add("dragging");
  last.set(e.clientX, e.clientY);
  velocity.set(0, 0);
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", (e) => {
  mouse.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  if (!dragging) return;
  const dx = (e.clientX - last.x) * pxToWorld;
  const dy = (e.clientY - last.y) * pxToWorld;
  offset.x += dx;
  offset.y -= dy;
  velocity.set(dx, -dy);
  last.set(e.clientX, e.clientY);
});

function endDrag() {
  dragging = false;
  canvas.classList.remove("dragging");
}
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);

canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    offset.x -= e.deltaX * pxToWorld;
    offset.y += e.deltaY * pxToWorld;
  },
  { passive: false }
);

// --- hover picking -----------------------------------------------------------

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-10, -10);

// --- resize ------------------------------------------------------------------

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updatePxToWorld();
}
window.addEventListener("resize", resize);
resize();

// --- clocks in the header ------------------------------------------------------

function tickClocks() {
  const fmt = (tz) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: tz,
    }).format(new Date());
  const ldn = document.getElementById("clock-ldn");
  const akl = document.getElementById("clock-akl");
  if (ldn) ldn.textContent = fmt("Europe/London");
  if (akl) akl.textContent = fmt("Pacific/Auckland");
}
tickClocks();
setInterval(tickClocks, 30000);

// --- render loop ---------------------------------------------------------------

const wrap = (v, range) => ((((v + range / 2) % range) + range) % range) - range / 2;

function render() {
  requestAnimationFrame(render);

  if (!dragging) {
    offset.add(velocity);
    velocity.multiplyScalar(0.94);
    // slow ambient drift so the wall never feels frozen
    offset.x += 0.0016;
    offset.y += 0.0007;
  }

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(cards)[0]?.object ?? null;

  for (const card of cards) {
    const { baseX, baseY } = card.userData;
    const x = wrap(baseX + offset.x, WRAP_W);
    const y = wrap(baseY + offset.y, WRAP_H);
    card.position.set(x, y, 0);

    const target = card === hit && !dragging ? 1 : 0;
    card.userData.hover += (target - card.userData.hover) * 0.12;
    card.material.uniforms.uHover.value = card.userData.hover;
    card.material.uniforms.uScale.value = 1 + card.userData.hover * 0.04;
  }

  renderer.render(scene, camera);
}
render();
