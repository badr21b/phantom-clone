import * as THREE from "three";
import { CITIES } from "./cities.js";
import { buildCardCanvases, CARD_ASPECT } from "./cards.js";
import { PaperReveal } from "./paper.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0a0a0a, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 10;

const paper = new PaperReveal();

const CARD_H = 3.0;
const CARD_W = CARD_H * CARD_ASPECT;
const GAP = 0.35;
const CELL_X = CARD_W + GAP;
const CELL_Y = CARD_H + GAP;
const COLS = 4;
const ROWS = 3;
const WRAP_W = COLS * CELL_X;
const WRAP_H = ROWS * CELL_Y;

const vertexShader = /* glsl */ `
  uniform float uRadius;
  uniform float uCurve;
  uniform float uPinch;
  uniform float uScale;
  varying vec2 vUv;
  varying float vFade;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position * uScale, 1.0);

    float d2 = dot(wp.xy, wp.xy);
    float R = uRadius;
    float zBow = R - sqrt(max(R * R - d2, 0.0001));
    wp.z += zBow * uCurve;
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
    tex *= 0.72 + 0.28 * vFade;
    tex *= 1.0 + uHover * 0.22;
    gl_FragColor = vec4(tex, 1.0);
  }
`;

const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 24, 24);
const cardCanvases = buildCardCanvases();
const textures = cardCanvases.map((c) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
});

const cards = [];
for (let col = 0; col < COLS; col++) {
  for (let row = 0; row < ROWS; row++) {
    const cityIdx = (col * ROWS + row) % CITIES.length;
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMap: { value: textures[cityIdx] },
        uRadius: { value: 9.5 },
        uCurve: { value: 1.35 },
        uPinch: { value: 0.42 },
        uScale: { value: 1 },
        uHover: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    const baseX = col * CELL_X;
    const baseY = row * CELL_Y + (col % 2 ? CELL_Y * 0.5 : 0);
    mesh.userData = { baseX, baseY, hover: 0, city: CITIES[cityIdx] };
    scene.add(mesh);
    cards.push(mesh);
  }
}

// --- drag / click -----------------------------------------------------------

const offset = new THREE.Vector2(0, 0);
const velocity = new THREE.Vector2(0, 0);
let dragging = false;
let pointerDown = false;
const pointerStart = new THREE.Vector2();
const last = new THREE.Vector2();
let pxToWorld = 0.01;
const CLICK_THRESHOLD = 8;

function updatePxToWorld() {
  const vFov = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFov / 2) * camera.position.z;
  pxToWorld = height / window.innerHeight;
}

canvas.addEventListener("pointerdown", (e) => {
  if (paper.isOpen()) return;
  pointerDown = true;
  dragging = true;
  canvas.classList.add("dragging");
  pointerStart.set(e.clientX, e.clientY);
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

function endPointer(e) {
  const moved = Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y);

  if (pointerDown && moved < CLICK_THRESHOLD && !paper.isOpen()) {
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(cards)[0];
    if (hit?.object?.userData?.city) {
      paper.show(hit.object.userData.city);
    }
  }

  pointerDown = false;
  dragging = false;
  canvas.classList.remove("dragging");
}

canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);

canvas.addEventListener(
  "wheel",
  (e) => {
    if (paper.isOpen()) return;
    e.preventDefault();
    offset.x -= e.deltaX * pxToWorld;
    offset.y += e.deltaY * pxToWorld;
  },
  { passive: false }
);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-10, -10);

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updatePxToWorld();
}
window.addEventListener("resize", resize);
resize();

function tickClock() {
  const el = document.getElementById("clock-alg");
  if (!el) return;
  el.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Algiers",
  }).format(new Date());
}
tickClock();
setInterval(tickClock, 30000);

const wrap = (v, range) => ((((v + range / 2) % range) + range) % range) - range / 2;

function render() {
  requestAnimationFrame(render);

  const frozen = paper.isOpen();

  if (!dragging && !frozen) {
    offset.add(velocity);
    velocity.multiplyScalar(0.94);
    offset.x += 0.0012;
    offset.y += 0.0005;
  }

  raycaster.setFromCamera(mouse, camera);
  const hit = !frozen && !dragging ? raycaster.intersectObjects(cards)[0]?.object ?? null : null;

  for (const card of cards) {
    const { baseX, baseY } = card.userData;
    card.position.set(wrap(baseX + offset.x, WRAP_W), wrap(baseY + offset.y, WRAP_H), 0);

    const target = card === hit ? 1 : 0;
    card.userData.hover += (target - card.userData.hover) * 0.12;
    card.material.uniforms.uHover.value = card.userData.hover;
    card.material.uniforms.uScale.value = 1 + card.userData.hover * 0.05;
  }

  canvas.style.cursor = frozen ? "default" : hit ? "pointer" : dragging ? "grabbing" : "grab";
  renderer.render(scene, camera);
}
render();
