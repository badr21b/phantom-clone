import { CITIES } from "./cities.js";

const TEX_W = 768;
const TEX_H = 960;

function drawArt(ctx, x, y, w, h, p) {
  const [a, b, c] = p.colors;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const bg = ctx.createLinearGradient(x, y, x, y + h);
  bg.addColorStop(0, a);
  bg.addColorStop(0.6, b);
  bg.addColorStop(1, c);
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  const cx = x + w / 2;
  const cy = y + h / 2;

  switch (p.art) {
    case "casbah": {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (let i = 0; i < 8; i++) {
        const bw = 40 + i * 18;
        const bh = 60 + i * 28;
        ctx.fillRect(cx - bw / 2 + i * 3, cy + 80 - bh, bw, bh);
      }
      ctx.fillStyle = "#1a3d5c";
      ctx.fillRect(cx - 8, cy - 120, 16, 80);
      ctx.beginPath();
      ctx.arc(cx, cy - 120, 28, Math.PI, 0);
      ctx.fill();
      break;
    }
    case "bridge": {
      ctx.strokeStyle = "#f5f0e6";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x + 20, cy + 60);
      ctx.quadraticCurveTo(cx, cy - 100, x + w - 20, cy + 60);
      ctx.stroke();
      ctx.fillStyle = "rgba(30,60,90,0.6)";
      ctx.fillRect(x, cy + 60, w, h - (cy - y + 60));
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 80 + i * 40, cy + 60);
        ctx.lineTo(cx - 60 + i * 30, cy - 20);
        ctx.stroke();
      }
      break;
    }
    case "fort": {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 40, w * 0.48, h * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy + 40);
      ctx.lineTo(cx - 50, cy - 80);
      ctx.lineTo(cx + 50, cy - 80);
      ctx.lineTo(cx + 60, cy + 40);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(cx - 8, cy - 110, 16, 40);
      break;
    }
    case "ksar": {
      const s = 52;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
          const bh = 40 + row * 22;
          ctx.fillStyle = row % 2 ? "#e8a838" : "#c45c26";
          ctx.fillRect(x + col * s + 30, cy + 60 - bh - row * 30, s - 6, bh);
        }
      }
      break;
    }
    case "roman": {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 4;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(cx - 90 + i * 30, cy + 30, 18, Math.PI, 0);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(168,218,220,0.5)";
      ctx.fillRect(x, cy + 50, w, 40);
      break;
    }
    case "hoggar": {
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 ? "#4a1942" : "#ff6b35";
        ctx.beginPath();
        ctx.moveTo(cx - 120 + i * 50, cy + 80);
        ctx.lineTo(cx - 80 + i * 50, cy - 60 - i * 20);
        ctx.lineTo(cx - 40 + i * 50, cy + 80);
        ctx.fill();
      }
      ctx.fillStyle = "#f4a261";
      ctx.beginPath();
      ctx.arc(cx + 80, cy - 40, 36, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "rockart": {
      ctx.fillStyle = "#d4a574";
      ctx.fillRect(x + 40, cy - 60, w - 80, 160);
      ctx.strokeStyle = "#8b4513";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy);
      ctx.lineTo(cx - 20, cy - 40);
      ctx.lineTo(cx + 20, cy - 20);
      ctx.lineTo(cx + 50, cy + 10);
      ctx.stroke();
      ctx.fillStyle = "#1a0f0a";
      for (const [ox, oy] of [[-40, -20], [0, -30], [40, 0], [-10, 20]]) {
        ctx.beginPath();
        ctx.arc(cx + ox, cy + oy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "palace": {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.roundRect(cx - 100, cy - 40, 200, 120, 8);
      ctx.fill();
      ctx.fillStyle = "#06d6a0";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(cx - 80 + i * 40, cy - 40, 14, Math.PI, 0);
        ctx.fill();
      }
      ctx.fillStyle = "#118ab2";
      ctx.fillRect(cx - 12, cy - 100, 24, 70);
      ctx.beginPath();
      ctx.arc(cx, cy - 100, 20, Math.PI, 0);
      ctx.fill();
      break;
    }
    case "mountain": {
      ctx.fillStyle = "#48cae4";
      ctx.beginPath();
      ctx.moveTo(cx - 140, cy + 80);
      ctx.lineTo(cx, cy - 100);
      ctx.lineTo(cx + 140, cy + 80);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#023e8a";
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy + 80);
      ctx.lineTo(cx - 20, cy - 30);
      ctx.lineTo(cx + 60, cy + 80);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "timgad": {
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(cx - 70 + i * 20, cy + 20, 16, Math.PI, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = "#e9c46a";
      ctx.strokeRect(cx - 90, cy - 60, 180, 100);
      ctx.fillStyle = "#264653";
      ctx.fillRect(cx - 30, cy - 90, 60, 30);
      break;
    }
    case "oasis": {
      ctx.fillStyle = "#e07a5f";
      ctx.fillRect(x, cy + 20, w, h - (cy - y + 20));
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = "#2d6a4f";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 80 + i * 30, cy + 80);
        ctx.quadraticCurveTo(cx - 60 + i * 30, cy - 40, cx - 40 + i * 30, cy - 80);
        ctx.stroke();
      }
      ctx.fillStyle = "#f2cc8f";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, 90, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "basilica": {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy + 60);
      ctx.lineTo(cx - 60, cy - 60);
      ctx.lineTo(cx + 60, cy - 60);
      ctx.lineTo(cx + 80, cy + 60);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#6c63ff";
      ctx.fillRect(cx - 10, cy - 100, 20, 50);
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 100);
      ctx.lineTo(cx, cy - 130);
      ctx.lineTo(cx + 30, cy - 100);
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

function drawCard(city) {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0f0e0c";
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  const mono = "500 20px 'SF Mono', Menlo, monospace";

  ctx.font = mono;
  ctx.fillStyle = "#d9d9d4";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(city.city, 36, 44);
  ctx.textAlign = "right";
  ctx.fillText(city.landmark, TEX_W - 36, 44);

  const pad = 96;
  drawArt(ctx, pad, 130, TEX_W - pad * 2, TEX_H - 320, city);

  let px = 36;
  const py = TEX_H - 96;
  ctx.font = mono;
  for (const tag of city.tags) {
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

  ctx.fillStyle = "#8a8a85";
  ctx.textAlign = "right";
  ctx.fillText(city.region, TEX_W - 36, py + 14);

  return canvas;
}

export function buildCardCanvases() {
  return CITIES.map(drawCard);
}

export const CARD_ASPECT = TEX_W / TEX_H;
