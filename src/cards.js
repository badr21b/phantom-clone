// Procedurally drawn project cards (original placeholder content).
// Each card is a canvas: artwork in the middle, mono labels around it,
// tag pills at the bottom — echoing the phantom.land card layout.

const PROJECTS = [
  { client: "AURORA LABS", title: "SOLAR COMPASS", tags: ["EXPERIENCE", "WEBSITE", "3D"], year: "2024", art: "orb", colors: ["#ff9a3c", "#d43900", "#2a0a00"] },
  { client: "MIRRORBALL", title: "MIDNIGHT DISCO", tags: ["EXPERIENCE", "3D"], year: "2025", art: "mosaic", colors: ["#ff2244", "#7a0018", "#160004"] },
  { client: "NORTHWIND", title: "GLACIER INDEX", tags: ["WEBSITE", "CONTENT"], year: "2026", art: "waves", colors: ["#9fd8ff", "#1c6ea8", "#02121f"] },
  { client: "CASA VERDE", title: "COASTAL SPIRITS", tags: ["COMMUNICATION", "ILLUSTRATION", "3D"], year: "2025", art: "bottles", colors: ["#57b8ff", "#0a67b0", "#eaf6ff"] },
  { client: "FIELDNOTES", title: "PAPER GARDEN", tags: ["3D", "MOTION"], year: "2026", art: "emboss", colors: ["#e8e4da", "#b9b3a4", "#6f6a5d"] },
  { client: "HELIOTROPE", title: "SIGNAL BLOOM", tags: ["CAMPAIGN", "TOOL"], year: "2025", art: "rings", colors: ["#c7b0ff", "#5d2fbd", "#0d0420"] },
  { client: "OKTO", title: "NIGHT MARKET", tags: ["EXPERIENCE", "OOH"], year: "2024", art: "grid", colors: ["#ffd23c", "#c77800", "#1f1200"] },
  { client: "VANTA CO", title: "BRAND SYSTEMS", tags: ["WEBSITE", "IDENTITY"], year: "2025", art: "type", colors: ["#f2f2ef", "#8a8a85", "#111111"] },
  { client: "LUMEN", title: "AI FIELD GUIDE", tags: ["EXPERIENCE", "AI", "CONTENT"], year: "2026", art: "scatter", colors: ["#7dffc4", "#0f9d63", "#001a0f"] },
  { client: "ORBITA", title: "PLAYABLE FILM", tags: ["GAME", "FILM"], year: "2024", art: "orbits", colors: ["#ff7ad9", "#a1128f", "#1c0018"] },
  { client: "KILN", title: "FESTIVE HALO", tags: ["INSTALLATION", "AI"], year: "2025", art: "halo", colors: ["#ffcf7d", "#b06a0f", "#1a0e00"] },
  { client: "PORTHOLE", title: "DEEP ATLAS", tags: ["WEBSITE", "DATA"], year: "2026", art: "contour", colors: ["#7db8ff", "#1140a1", "#00071c"] },
];

const TEX_W = 768;
const TEX_H = 960;

function drawArt(ctx, x, y, w, h, p) {
  const [a, b, c] = p.colors;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // background wash
  const bg = ctx.createLinearGradient(x, y, x, y + h);
  bg.addColorStop(0, c);
  bg.addColorStop(1, "#000000");
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  const cx = x + w / 2;
  const cy = y + h / 2;

  switch (p.art) {
    case "orb": {
      const g = ctx.createRadialGradient(cx - w * 0.1, cy - h * 0.15, 10, cx, cy, w * 0.45);
      g.addColorStop(0, a);
      g.addColorStop(0.7, b);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.05, w * 0.34, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "mosaic": {
      const n = 14;
      const s = w / n;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < Math.ceil(h / s); j++) {
          const d = Math.hypot(i - n / 2, j - h / s / 2);
          const t = Math.max(0, 1 - d / (n * 0.6)) * (0.5 + 0.5 * Math.sin(i * 3.7 + j * 2.1));
          ctx.fillStyle = t > 0.5 ? a : t > 0.2 ? b : c;
          ctx.globalAlpha = 0.2 + t * 0.8;
          ctx.fillRect(x + i * s + 1, y + j * s + 1, s - 2, s - 2);
        }
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "waves": {
      for (let k = 0; k < 9; k++) {
        ctx.strokeStyle = k % 2 ? a : b;
        ctx.globalAlpha = 0.9 - k * 0.08;
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let i = 0; i <= w; i += 6) {
          const yy = cy + Math.sin(i * 0.015 + k * 0.9) * (14 + k * 9) + (k - 4) * 22;
          i === 0 ? ctx.moveTo(x + i, yy) : ctx.lineTo(x + i, yy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "bottles": {
      const sky = ctx.createLinearGradient(x, y, x, y + h);
      sky.addColorStop(0, a);
      sky.addColorStop(1, c);
      ctx.fillStyle = sky;
      ctx.fillRect(x, y, w, h);
      for (const off of [-0.14, 0.14]) {
        const bx = cx + w * off;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.roundRect(bx - 34, cy - 90, 68, 190, 18);
        ctx.fill();
        ctx.fillRect(bx - 10, cy - 130, 20, 46);
        ctx.fillStyle = b;
        ctx.fillRect(bx - 26, cy - 30, 52, 84);
      }
      break;
    }
    case "emboss": {
      ctx.fillStyle = a;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = b;
      ctx.fillRect(x, y + 24, w, 10);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.beginPath();
        ctx.roundRect(cx - 110 + i * 4, cy - 60 + i * 4, 220, 140, 24);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.roundRect(cx - 110, cy - 60, 220, 140, 24);
      ctx.fill();
      ctx.fillStyle = c;
      ctx.font = "700 64px Helvetica";
      ctx.textAlign = "center";
      ctx.fillText("PG", cx, cy + 32);
      break;
    }
    case "rings": {
      for (let k = 10; k > 0; k--) {
        ctx.strokeStyle = k % 2 ? a : b;
        ctx.globalAlpha = 0.15 + (k / 10) * 0.5;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.ellipse(cx, cy, k * w * 0.045, k * w * 0.03, -0.4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "grid": {
      ctx.strokeStyle = b;
      ctx.lineWidth = 2;
      const s = 42;
      for (let i = 0; i < w / s + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * s, y);
        ctx.lineTo(x + i * s, y + h);
        ctx.stroke();
      }
      for (let j = 0; j < h / s + 1; j++) {
        ctx.beginPath();
        ctx.moveTo(x, y + j * s);
        ctx.lineTo(x + w, y + j * s);
        ctx.stroke();
      }
      ctx.fillStyle = a;
      for (let i = 0; i < 26; i++) {
        const gx = x + Math.floor(Math.random() * (w / s)) * s;
        const gy = y + Math.floor(Math.random() * (h / s)) * s;
        ctx.fillRect(gx + 2, gy + 2, s - 4, s - 4);
      }
      break;
    }
    case "type": {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = a;
      ctx.textAlign = "left";
      ctx.font = "700 96px Helvetica";
      ctx.fillText("Aa", x + 40, cy - 40);
      ctx.font = "400 96px Georgia";
      ctx.fillStyle = b;
      ctx.fillText("Aa", x + 40, cy + 80);
      ctx.strokeStyle = b;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 28, cy - 130, w - 56, 240);
      break;
    }
    case "scatter": {
      for (let i = 0; i < 400; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.5) * w * 0.42;
        ctx.fillStyle = Math.random() > 0.5 ? a : b;
        ctx.globalAlpha = 0.3 + Math.random() * 0.7;
        const s = 2 + Math.random() * 5;
        ctx.fillRect(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.8, s, s);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "orbits": {
      ctx.strokeStyle = b;
      ctx.lineWidth = 2;
      for (let k = 1; k <= 5; k++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, k * 44, k * 26, 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = a;
        const t = k * 1.7;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(t) * k * 44, cy + Math.sin(t) * k * 26, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "halo": {
      const g = ctx.createRadialGradient(cx, cy, w * 0.1, cx, cy, w * 0.45);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.55, a);
      g.addColorStop(0.75, b);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 60; i++) {
        ctx.globalAlpha = Math.random() * 0.9;
        ctx.fillRect(x + Math.random() * w, y + Math.random() * h, 2, 2);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "contour": {
      for (let k = 0; k < 16; k++) {
        ctx.strokeStyle = k % 3 ? b : a;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= w; i += 8) {
          const yy =
            y + (k / 16) * h + Math.sin(i * 0.02 + k) * 16 + Math.sin(i * 0.007 + k * 2.3) * 26;
          i === 0 ? ctx.moveTo(x + i, yy) : ctx.lineTo(x + i, yy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
  }
  ctx.restore();
}

function drawCard(p) {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  const mono = "500 20px 'SF Mono', Menlo, monospace";

  // header row: client left, title right
  ctx.font = mono;
  ctx.fillStyle = "#d9d9d4";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(p.client, 36, 44);
  ctx.textAlign = "right";
  ctx.fillText(p.title, TEX_W - 36, 44);

  // artwork
  const pad = 96;
  drawArt(ctx, pad, 130, TEX_W - pad * 2, TEX_H - 320, p);

  // tag pills bottom-left
  let px = 36;
  const py = TEX_H - 96;
  ctx.font = mono;
  for (const tag of p.tags) {
    const tw = ctx.measureText(tag).width;
    ctx.strokeStyle = "#55554f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px, py, tw + 40, 46, 23);
    ctx.stroke();
    ctx.fillStyle = "#d9d9d4";
    ctx.textAlign = "left";
    ctx.fillText(tag, px + 20, py + 14);
    px += tw + 56;
  }

  // year bottom-right
  ctx.fillStyle = "#8a8a85";
  ctx.textAlign = "right";
  ctx.fillText(p.year, TEX_W - 36, py + 14);

  return canvas;
}

export function buildCardCanvases() {
  return PROJECTS.map(drawCard);
}

export const CARD_ASPECT = TEX_W / TEX_H;
