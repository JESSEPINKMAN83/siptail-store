"use client";

import { useEffect, useRef } from "react";

/**
 * TrailScene — a procedural golden-hour landscape over Mediterranean hills.
 *
 * The camera drifts sideways as if you are walking a trail and looking out to
 * your left: eight depth layers slide at their own parallax speeds, the horizon
 * bobs gently with your stride, and the scene settles out of a faster "head
 * turn" during the first couple of seconds.
 *
 * Everything is drawn from maths on one 2D canvas — no image assets and no new
 * dependencies. What makes it read as photographic rather than flat vector:
 *
 *  - aerial perspective: each ridge is fog-mixed toward the horizon colour
 *  - every ridge is gradient-shaded (lit crest, dark base) with a warm rim
 *  - painterly clouds pre-rendered once from dozens of radial-gradient lobes,
 *    their undersides tinted by the low sun
 *  - a sun pillar, horizon bloom and valley mist between the far ridges
 *  - trees grow in irregular clusters, never in even rows
 *  - a film-grain pass and a soft vignette grade the final frame
 */

// __TYPES__
type RGB = [number, number, number];
type TreeKind = "cypress" | "pine" | "scrub";
type Layer = {
  depth: number;      // parallax factor — 0 is infinitely far, >1 at your feet
  yBase: number;      // horizon offset as a fraction of canvas height
  amps: [number, number, number];
  freqs: [number, number, number];
  phase: number;
  base: RGB;          // intrinsic colour before atmospheric fog
  fog: number;        // 0..1 mix toward the horizon haze
  trees?: { spacing: number; height: number; kind: TreeKind };
};
type Cloud = {
  img: HTMLCanvasElement;
  x0: number;         // 0..1 starting position across the loop span
  y: number;          // fraction of canvas height
  scale: number;
  speed: number;      // parallax factor against walked distance
  alpha: number;
  stretch: number;    // horizontal stretch for wispiness
};
// __END_TYPES__

const SUN_X = 0.74;
const SUN_Y = 0.585;

const SKY_STOPS: Array<[number, string]> = [
  [0.00, "#121D36"],
  [0.14, "#243A55"],
  [0.30, "#435871"],
  [0.44, "#6F7A8C"],
  [0.52, "#A48478"],
  [0.63, "#D29465"],
  [0.78, "#EFBB80"],
  [0.89, "#FADFAC"],
  [1.00, "#FFF2D2"],
];

const HAZE: RGB = [232, 190, 148];
const SUN_WARM: RGB = [255, 222, 172];

const LAYERS: Layer[] = [
  { depth: 0.05, yBase: 0.585, amps: [58, 26, 12], freqs: [0.00150, 0.00360, 0.00810], phase: 0.0,  base: [80, 96, 116],  fog: 0.56 },
  { depth: 0.10, yBase: 0.635, amps: [66, 30, 14], freqs: [0.00132, 0.00325, 0.00730], phase: 1.7,  base: [70, 88, 104],  fog: 0.44 },
  { depth: 0.18, yBase: 0.690, amps: [72, 33, 16], freqs: [0.00118, 0.00295, 0.00660], phase: 3.1,  base: [58, 78, 82],   fog: 0.30 },
  { depth: 0.30, yBase: 0.745, amps: [68, 32, 16], freqs: [0.00104, 0.00265, 0.00590], phase: 4.6,  base: [56, 84, 60],   fog: 0.18,
    trees: { spacing: 128, height: 22, kind: "pine" } },
  { depth: 0.46, yBase: 0.800, amps: [58, 28, 14], freqs: [0.00092, 0.00238, 0.00530], phase: 6.2,  base: [40, 66, 46],   fog: 0.10,
    trees: { spacing: 94, height: 36, kind: "cypress" } },
  { depth: 0.66, yBase: 0.862, amps: [46, 23, 12], freqs: [0.00080, 0.00212, 0.00470], phase: 8.4,  base: [27, 48, 33],   fog: 0.05,
    trees: { spacing: 72, height: 54, kind: "cypress" } },
  { depth: 0.90, yBase: 0.930, amps: [34, 18, 10], freqs: [0.00070, 0.00190, 0.00420], phase: 10.9, base: [14, 28, 18],   fog: 0.02,
    trees: { spacing: 110, height: 40, kind: "cypress" } },
  { depth: 1.35, yBase: 0.988, amps: [24, 14, 8],  freqs: [0.00062, 0.00170, 0.00380], phase: 13.5, base: [9, 19, 12],    fog: 0.0,
    trees: { spacing: 34, height: 46, kind: "scrub" } },
];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function shade(c: RGB, t: number): RGB {
  return t >= 0 ? mix(c, [255, 255, 255], t) : mix(c, [0, 0, 0], -t);
}
function rgba(c: RGB, a: number): string {
  return `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;
}

// Final on-screen colours after atmospheric fog, computed once.
const LAYER_FILL: RGB[] = LAYERS.map((l) => mix(l.base, HAZE, l.fog));
const LAYER_TOP: RGB[] = LAYERS.map((l, i) => mix(LAYER_FILL[i], SUN_WARM, 0.05 + 0.11 * (1 - Math.min(l.depth, 1))));
const LAYER_BOT: RGB[] = LAYERS.map((l, i) => shade(LAYER_FILL[i], -0.34));
const TREE_FILL: string[] = LAYERS.map((l, i) => rgba(shade(LAYER_FILL[i], -0.20), 1));

/** Deterministic 0..1 hash — keeps every placement stable across frames. */
function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}

/** Endless, seam-free terrain profile: a sum of three sines in world space. */
function ridgeY(layer: Layer, worldX: number, h: number): number {
  const a = layer.amps;
  const f = layer.freqs;
  return (
    layer.yBase * h +
    a[0] * Math.sin(worldX * f[0] + layer.phase) +
    a[1] * Math.sin(worldX * f[1] + layer.phase * 1.7) +
    a[2] * Math.sin(worldX * f[2] + layer.phase * 2.9)
  );
}

export default function TrailScene({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let startedAt = performance.now();

    // ── Cached passes (rebuilt on resize) ─────────────────────────────
    let skyGrad: CanvasGradient | null = null;
    let layerGrads: CanvasGradient[] = [];
    let vignette: HTMLCanvasElement | null = null;

    // ── Pre-rendered sprites (built once) ─────────────────────────────
    let clouds: Cloud[] = [];
    let grainPattern: CanvasPattern | null = null;
    let moteSprite: HTMLCanvasElement | null = null;

    function buildCloudSprite(seed: number, warm: number): HTMLCanvasElement {
      const cw = 480;
      const ch = 200;
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const g = c.getContext("2d");
      if (!g) return c;
      // Two passes of soft radial lobes arranged in an arch with a flat base.
      for (let pass = 0; pass < 2; pass++) {
        const lobes = 7 + Math.floor(hash(seed + pass * 17.3) * 4);
        for (let i = 0; i < lobes; i++) {
          const u = i / (lobes - 1);
          const arch = Math.sin(u * Math.PI);
          const fx = 70 + (cw - 140) * u + (hash(seed + pass * 11 + i * 2.1) - 0.5) * 50;
          const fy = ch * 0.66 - arch * ch * (0.14 + hash(seed + pass * 13 + i * 3.7) * 0.18) + pass * 8;
          const fr = (32 + hash(seed + pass * 7 + i * 5.3) * 38 + arch * 18) * (pass === 1 ? 0.68 : 1);
          const a = 0.15 + hash(seed + pass * 5 + i * 7.9) * 0.13;
          const rad = g.createRadialGradient(fx, fy, fr * 0.15, fx, fy, fr);
          rad.addColorStop(0, `rgba(238, 234, 240, ${a})`);
          rad.addColorStop(0.62, `rgba(231, 226, 235, ${a * 0.55})`);
          rad.addColorStop(1, "rgba(228, 224, 233, 0)");
          g.fillStyle = rad;
          g.beginPath();
          g.arc(fx, fy, fr, 0, Math.PI * 2);
          g.fill();
        }
      }
      if (warm > 0) {
        // The low sun tints every cloud from below.
        g.globalCompositeOperation = "source-atop";
        const tint = g.createLinearGradient(0, ch * 0.28, 0, ch);
        tint.addColorStop(0, "rgba(255, 208, 156, 0)");
        tint.addColorStop(0.6, `rgba(252, 184, 124, ${0.28 * warm})`);
        tint.addColorStop(1, `rgba(248, 162, 104, ${0.55 * warm})`);
        g.fillStyle = tint;
        g.fillRect(0, 0, cw, ch);
        g.globalCompositeOperation = "source-over";
      }
      return c;
    }

    function buildSprites() {
      clouds = [];
      // High, cool and small — far from the sun's influence.
      for (let i = 0; i < 3; i++) {
        clouds.push({
          img: buildCloudSprite(3 + i * 7.7, 0.3),
          x0: (i + hash(i * 3.1)) / 3,
          y: 0.04 + hash(i * 5.9) * 0.10,
          scale: 0.45 + hash(i * 8.3) * 0.3,
          speed: 0.006,
          alpha: 0.30,
          stretch: 1.25 + hash(i * 2.7) * 0.4,
        });
      }
      // Mid band.
      for (let i = 0; i < 2; i++) {
        clouds.push({
          img: buildCloudSprite(31 + i * 9.2, 0.55),
          x0: hash(40 + i * 4.4),
          y: 0.22 + hash(44 + i * 6.1) * 0.07,
          scale: 0.68 + hash(48 + i * 3.3) * 0.24,
          speed: 0.011,
          alpha: 0.44,
          stretch: 1.15,
        });
      }
      // Low, warm and heavy — hanging near the sun.
      for (let i = 0; i < 2; i++) {
        clouds.push({
          img: buildCloudSprite(71 + i * 13.7, 1),
          x0: 0.55 + hash(70 + i * 5.2) * 0.4,
          y: 0.40 + hash(74 + i * 7.7) * 0.09,
          scale: 1.35 + hash(78 + i * 2.9) * 0.55,
          speed: 0.017,
          alpha: 0.72,
          stretch: 1.3,
        });
      }

      // Film-grain tile.
      const tile = document.createElement("canvas");
      tile.width = 128;
      tile.height = 128;
      const tg = tile.getContext("2d");
      if (tg) {
        const id = tg.createImageData(128, 128);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = 110 + Math.random() * 40;
          id.data[i] = v;
          id.data[i + 1] = v;
          id.data[i + 2] = v;
          id.data[i + 3] = 255;
        }
        tg.putImageData(id, 0, 0);
        grainPattern = ctx.createPattern(tile, "repeat");
      }

      // Glowing dust-mote sprite.
      const m = document.createElement("canvas");
      m.width = 32;
      m.height = 32;
      const mg = m.getContext("2d");
      if (mg) {
        const rad = mg.createRadialGradient(16, 16, 0, 16, 16, 16);
        rad.addColorStop(0, "rgba(255, 227, 176, 0.9)");
        rad.addColorStop(0.35, "rgba(255, 216, 156, 0.35)");
        rad.addColorStop(1, "rgba(255, 210, 150, 0)");
        mg.fillStyle = rad;
        mg.fillRect(0, 0, 32, 32);
      }
      moteSprite = m;
    }

    function rebuildCaches() {
      skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.98);
      for (const [stop, color] of SKY_STOPS) skyGrad.addColorStop(stop, color);

      layerGrads = LAYERS.map((l, i) => {
        const top = l.yBase * height - (l.amps[0] + l.amps[1] + l.amps[2]) - 10;
        const g = ctx.createLinearGradient(0, top, 0, height);
        g.addColorStop(0, rgba(LAYER_TOP[i], 1));
        g.addColorStop(0.38, rgba(LAYER_FILL[i], 1));
        g.addColorStop(1, rgba(LAYER_BOT[i], 1));
        return g;
      });

      const v = document.createElement("canvas");
      v.width = Math.max(1, width);
      v.height = Math.max(1, height);
      const vg = v.getContext("2d");
      if (vg) {
        const r = Math.hypot(width, height) * 0.72;
        const rad = vg.createRadialGradient(
          width * 0.5, height * 0.46, Math.min(width, height) * 0.42,
          width * 0.5, height * 0.46, r
        );
        rad.addColorStop(0, "rgba(6, 12, 9, 0)");
        rad.addColorStop(1, "rgba(6, 12, 9, 0.34)");
        vg.fillStyle = rad;
        vg.fillRect(0, 0, width, height);
        const top = vg.createLinearGradient(0, 0, 0, height * 0.26);
        top.addColorStop(0, "rgba(4, 9, 15, 0.20)");
        top.addColorStop(1, "rgba(4, 9, 15, 0)");
        vg.fillStyle = top;
        vg.fillRect(0, 0, width, height * 0.26);
      }
      vignette = v;
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildCaches();
    }

    function drawSky(w: number, h: number) {
      if (skyGrad) ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);
    }

    function drawStars(w: number, h: number, t: number) {
      ctx.save();
      for (let i = 0; i < 42; i++) {
        const x = hash(i * 2.3) * w;
        const y = hash(i * 7.7) * h * 0.34;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.0012 + i));
        ctx.globalAlpha = tw * 0.4 * (1 - y / (h * 0.36));
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x, y, 1.3, 1.3);
      }
      ctx.restore();
    }

    function drawSun(w: number, h: number, t: number) {
      const cx = w * SUN_X;
      const cy = h * SUN_Y + Math.sin(t * 0.00008) * 4;
      const r = Math.max(26, Math.min(w, h) * 0.046);

      // Wide halo.
      const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 13);
      glow.addColorStop(0, "rgba(255, 230, 180, 0.72)");
      glow.addColorStop(0.25, "rgba(250, 196, 138, 0.30)");
      glow.addColorStop(0.6, "rgba(228, 152, 118, 0.10)");
      glow.addColorStop(1, "rgba(228, 152, 118, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 13, 0, Math.PI * 2);
      ctx.fill();

      // Sun pillar — the vertical column of light low sun throws through haze,
      // drawn as a vertically-stretched radial so it fades in both axes.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 5.2);
      const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.7);
      pg.addColorStop(0, "rgba(255, 218, 162, 0.16)");
      pg.addColorStop(0.55, "rgba(255, 218, 162, 0.07)");
      pg.addColorStop(1, "rgba(255, 218, 162, 0)");
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Disc with a soft edge.
      const disc = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.15);
      disc.addColorStop(0, "#FFF7DF");
      disc.addColorStop(0.8, "#FFEFC4");
      disc.addColorStop(1, "rgba(255, 239, 196, 0)");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawHorizonBloom(w: number, h: number, strength: number) {
      ctx.save();
      ctx.translate(w * SUN_X, h * 0.615);
      ctx.scale(1, 0.3);
      const rad = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.46);
      rad.addColorStop(0, `rgba(255, 198, 130, ${0.36 * strength})`);
      rad.addColorStop(0.5, `rgba(255, 198, 130, ${0.14 * strength})`);
      rad.addColorStop(1, "rgba(255, 198, 130, 0)");
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(0, 0, w * 0.46, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawClouds(w: number, h: number, dist: number, t: number) {
      ctx.save();
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        const cw = c.img.width * c.scale * c.stretch * (w / 1900 + 0.55);
        const chh = c.img.height * c.scale * (w / 1900 + 0.55);
        const span = w + cw;
        let sx = (c.x0 * span - dist * c.speed - t * 0.0035 * (c.speed / 0.01)) % span;
        if (sx < 0) sx += span;
        sx -= cw;
        const sy = c.y * h + Math.sin(t * 0.0002 + i * 2.1) * 4;
        ctx.globalAlpha = c.alpha;
        ctx.drawImage(c.img, sx, sy, cw, chh);
      }
      ctx.restore();
    }

    function drawMist(w: number, yc: number, a: number) {
      const g = ctx.createLinearGradient(0, yc - 70, 0, yc + 50);
      g.addColorStop(0, rgba(HAZE, 0));
      g.addColorStop(0.55, rgba(HAZE, a));
      g.addColorStop(1, rgba(HAZE, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, yc - 70, w, 120);
    }

    function drawTree(x: number, groundY: number, size: number, kind: TreeKind, sway: number, fill: string, seed: number) {
      ctx.fillStyle = fill;
      if (kind === "cypress") {
        // Flame silhouette with a waist — the tree that says "Mediterranean".
        const w0 = size * (0.15 + hash(seed * 3.3) * 0.05);
        ctx.beginPath();
        ctx.moveTo(x - w0, groundY);
        ctx.quadraticCurveTo(x - w0 * 1.3 + sway * 0.3, groundY - size * 0.36, x - w0 * 0.34 + sway * 0.6, groundY - size * 0.76);
        ctx.quadraticCurveTo(x + sway * 0.9, groundY - size * 0.93, x + sway, groundY - size);
        ctx.quadraticCurveTo(x + sway * 0.9 + w0 * 0.2, groundY - size * 0.9, x + w0 * 0.34 + sway * 0.6, groundY - size * 0.76);
        ctx.quadraticCurveTo(x + w0 * 1.3 + sway * 0.3, groundY - size * 0.36, x + w0, groundY);
        ctx.closePath();
        ctx.fill();
      } else if (kind === "pine") {
        // Distant stone pine — a soft canopy on a thin trunk.
        ctx.fillRect(x - size * 0.03, groundY - size * 0.34, size * 0.06, size * 0.34);
        ctx.beginPath();
        ctx.arc(x + sway * 0.4, groundY - size * 0.52, size * 0.30, 0, Math.PI * 2);
        ctx.arc(x - size * 0.20 + sway * 0.3, groundY - size * 0.38, size * 0.22, 0, Math.PI * 2);
        ctx.arc(x + size * 0.19 + sway * 0.3, groundY - size * 0.40, size * 0.21, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Foreground scrub — dry grass catching the wind.
        for (let b = 0; b < 4; b++) {
          const bx = x + (b - 1.5) * size * 0.10;
          const bh = size * (0.5 + hash(seed + b) * 0.65);
          const lean = sway * (1 + b * 0.22);
          ctx.beginPath();
          ctx.moveTo(bx - size * 0.022, groundY);
          ctx.quadraticCurveTo(bx + lean * 0.5, groundY - bh * 0.6, bx + lean, groundY - bh);
          ctx.quadraticCurveTo(bx + lean * 0.4, groundY - bh * 0.55, bx + size * 0.022, groundY);
          ctx.closePath();
          ctx.fill();
        }
        if (hash(seed * 7.7) > 0.6) {
          ctx.beginPath();
          ctx.arc(x + sway * 1.4, groundY - size * (0.6 + hash(seed) * 0.4), size * 0.035, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawLayer(idx: number, w: number, h: number, dist: number, t: number, bob: number) {
      const layer = LAYERS[idx];
      const worldOffset = dist * layer.depth;
      const step = layer.depth > 0.8 ? 6 : 10;

      ctx.fillStyle = layerGrads[idx] ?? rgba(LAYER_FILL[idx], 1);
      ctx.beginPath();
      ctx.moveTo(0, h + 4);
      for (let sx = 0; sx <= w + step; sx += step) {
        const wx = sx + worldOffset;
        ctx.lineTo(sx, ridgeY(layer, wx, h) + bob * layer.depth);
      }
      ctx.lineTo(w + step, h + 4);
      ctx.closePath();
      ctx.fill();

      // Warm rim along the sunlit crest, brightest beneath the sun.
      const sunX = w * SUN_X;
      const strength = Math.max(0.14, 0.46 * (1 - layer.depth * 0.55));
      const rim = ctx.createLinearGradient(sunX - w * 0.55, 0, sunX + w * 0.55, 0);
      rim.addColorStop(0, "rgba(255, 224, 176, 0)");
      rim.addColorStop(0.5, `rgba(255, 226, 180, ${strength.toFixed(3)})`);
      rim.addColorStop(1, "rgba(255, 224, 176, 0)");
      ctx.strokeStyle = rim;
      ctx.lineWidth = layer.depth < 0.4 ? 1.8 : 1.2;
      ctx.beginPath();
      for (let sx = 0; sx <= w + step; sx += step) {
        const wx = sx + worldOffset;
        const y = ridgeY(layer, wx, h) + bob * layer.depth;
        if (sx === 0) ctx.moveTo(sx, y);
        else ctx.lineTo(sx, y);
      }
      ctx.stroke();

      if (!layer.trees) return;
      const spacing = layer.trees.spacing;
      const th = layer.trees.height;
      const kind = layer.trees.kind;
      const first = Math.floor(worldOffset / spacing) - 1;
      const last = Math.ceil((worldOffset + w) / spacing) + 1;
      for (let i = first; i <= last; i++) {
        const gate = hash(i * 9.17 + idx * 3.7);
        if (gate < (kind === "scrub" ? 0.42 : 0.34)) continue; // clusters, not picket fences
        const wx = i * spacing + hash(i * 1.37) * spacing * 0.55;
        const sx = wx - worldOffset;
        if (sx < -80 || sx > w + 80) continue;
        const gy = ridgeY(layer, wx, h) + bob * layer.depth + 1;
        const scale = 0.45 + hash(i * 3.11) * 0.95;
        const sway = Math.sin(t * 0.0011 + i * 0.9) * (kind === "scrub" ? 4.5 : 1.6) * layer.depth;
        drawTree(sx, gy, th * scale, kind, sway, TREE_FILL[idx], i);
        if (gate > 0.72) {
          const wx2 = wx + spacing * 0.3;
          const sx2 = wx2 - worldOffset;
          const gy2 = ridgeY(layer, wx2, h) + bob * layer.depth + 1;
          drawTree(sx2, gy2, th * scale * 0.62, kind, sway * 0.8, TREE_FILL[idx], i + 0.5);
        }
      }
    }

    function drawBirds(w: number, h: number, dist: number, t: number) {
      ctx.save();
      ctx.strokeStyle = "rgba(26, 34, 40, 0.55)";
      ctx.lineWidth = 1.3;
      ctx.lineCap = "round";
      for (let i = 0; i < 4; i++) {
        const span = 1500;
        const bx = ((i * 349 + t * 0.02 + dist * 0.05) % span) - 120;
        const by = h * (0.16 + hash(i * 5.5) * 0.14) + Math.sin(t * 0.0009 + i) * 9;
        const flap = Math.sin(t * 0.008 + i * 2) * 3;
        const s = 4 + hash(i * 9.1) * 3;
        ctx.beginPath();
        ctx.moveTo(bx - s, by + flap);
        ctx.quadraticCurveTo(bx, by - flap * 0.6, bx + s, by + flap);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawMotes(w: number, h: number, dist: number, t: number) {
      if (!moteSprite) return;
      ctx.save();
      for (let i = 0; i < 26; i++) {
        const span = 900;
        const mx = (((hash(i * 4.4) * span - dist * 0.9) % span) + span) % span;
        const x = (mx / span) * (w + 120) - 60;
        const drift = Math.sin(t * 0.0006 + i * 1.7) * 22;
        const y = h * (0.58 + hash(i * 8.8) * 0.4) + drift;
        const s = 5 + hash(i * 2.2) * 11;
        ctx.globalAlpha = 0.25 + 0.45 * Math.abs(Math.sin(t * 0.0011 + i));
        ctx.drawImage(moteSprite, x - s / 2, y - s / 2, s, s);
      }
      ctx.restore();
    }

    function drawGrain(w: number, h: number, t: number) {
      if (!grainPattern) return;
      ctx.save();
      ctx.globalCompositeOperation = "soft-light";
      ctx.globalAlpha = 0.28;
      const ox = Math.floor(t * 0.09) % 128;
      const oy = Math.floor(t * 0.061) % 128;
      ctx.translate(-ox, -oy);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, w + 128, h + 128);
      ctx.restore();
    }

    function frame(now: number) {
      if (!running) return;
      const elapsed = now - startedAt;

      // Walking speed, in world units per millisecond. The first ~2.4s reads
      // as turning your head to look across the valley, then settling into pace.
      const base = 0.055;
      const settle = reduced ? 1 : 1 + 3.2 * Math.pow(1 - Math.min(elapsed / 2400, 1), 3);
      const dist = (reduced ? 8000 : elapsed * base * settle) + scrollRef.current * 0.55;

      // Stride bob — two footfalls per cycle, felt rather than seen.
      const bob = reduced ? 0 : Math.sin(elapsed * 0.0042) * 2.4 + pointerRef.current * 7;

      drawSky(width, height);
      drawStars(width, height, reduced ? 0 : elapsed);
      drawSun(width, height, elapsed);
      drawClouds(width, height, dist, elapsed);
      drawHorizonBloom(width, height, 1);
      drawBirds(width, height, dist, elapsed);

      for (let i = 0; i < LAYERS.length; i++) {
        drawLayer(i, width, height, dist, elapsed, bob);
        if (i === 2) drawHorizonBloom(width, height, 0.5);
        if (i === 4) drawHorizonBloom(width, height, 0.2);
        if (i === 2) drawMist(width, LAYERS[2].yBase * height - 8, 0.11);
        if (i === 3) drawMist(width, LAYERS[3].yBase * height - 8, 0.09);
        if (i === 4) drawMist(width, LAYERS[4].yBase * height - 8, 0.07);
      }

      drawMotes(width, height, dist, elapsed);
      drawGrain(width, height, reduced ? 0 : elapsed);
      if (vignette) ctx.drawImage(vignette, 0, 0);

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    buildSprites();
    resize();
    startedAt = performance.now();
    if (reduced) {
      frame(performance.now());
    } else {
      start();
    }

    const onResize = () => {
      resize();
      if (reduced) frame(performance.now());
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY || 0;
    };
    const onPointer = (e: PointerEvent) => {
      const rel = e.clientY / window.innerHeight - 0.5;
      pointerRef.current = Math.max(-1, Math.min(1, rel * 2));
    };
    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) stop();
      else {
        // Rebase the clock so the walk resumes rather than jumping ahead.
        startedAt = performance.now() - 8000;
        start();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%", background: "#121D36" }}
    />
  );
}
