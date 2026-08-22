"use client";

import { useEffect, useRef } from "react";

/**
 * TrailScene — a procedural, infinitely-scrolling Israeli hill landscape at golden hour.
 *
 * The camera drifts sideways as if you are walking a trail and looking out to your left:
 * every layer moves at its own speed (parallax), the horizon bobs gently with your stride,
 * and the scene settles out of a faster "head turn" during the first couple of seconds.
 *
 * Everything is drawn from maths — no image assets, no dependencies. Sums of sines give
 * each ridge an endless, seam-free profile; a small hash places trees deterministically,
 * so the world is identical on every render but never visibly repeats.
 */

type Layer = {
  depth: number;      // parallax factor — 0 is infinitely far, 1 is at your feet
  yBase: number;      // horizon offset as a fraction of canvas height
  amps: [number, number, number];
  freqs: [number, number, number];
  phase: number;
  fill: string;
  trees?: { spacing: number; height: number; kind: "cypress" | "pine" | "scrub" };
};

// Golden hour over Mediterranean hills, resolving into the Walk Essentials greens.
const SKY_STOPS: Array<[number, string]> = [
  [0.00, "#112543"],
  [0.15, "#264364"],
  [0.32, "#4C6A87"],
  [0.46, "#7C8C9B"],
  [0.57, "#AE8C87"],
  [0.67, "#D69A73"],
  [0.79, "#EFBC86"],
  [0.90, "#F8D8A4"],
  [1.00, "#FCEBCC"],
];

const LAYERS: Layer[] = [
  { depth: 0.05, yBase: 0.585, amps: [58, 26, 12], freqs: [0.00150, 0.00360, 0.00810], phase: 0.0,  fill: "#8AA0AE" },
  { depth: 0.10, yBase: 0.635, amps: [66, 30, 14], freqs: [0.00132, 0.00325, 0.00730], phase: 1.7,  fill: "#6C8497" },
  { depth: 0.18, yBase: 0.690, amps: [72, 33, 16], freqs: [0.00118, 0.00295, 0.00660], phase: 3.1,  fill: "#526E7C" },
  { depth: 0.30, yBase: 0.745, amps: [68, 32, 16], freqs: [0.00104, 0.00265, 0.00590], phase: 4.6,  fill: "#47665A",
    trees: { spacing: 128, height: 22, kind: "pine" } },
  { depth: 0.46, yBase: 0.800, amps: [58, 28, 14], freqs: [0.00092, 0.00238, 0.00530], phase: 6.2,  fill: "#2F4E39",
    trees: { spacing: 94, height: 36, kind: "cypress" } },
  { depth: 0.66, yBase: 0.862, amps: [46, 23, 12], freqs: [0.00080, 0.00212, 0.00470], phase: 8.4,  fill: "#1E3626",
    trees: { spacing: 72, height: 54, kind: "cypress" } },
  { depth: 0.90, yBase: 0.930, amps: [34, 18, 10], freqs: [0.00070, 0.00190, 0.00420], phase: 10.9, fill: "#152719" },
  { depth: 1.35, yBase: 0.988, amps: [24, 14, 8],  freqs: [0.00062, 0.00170, 0.00380], phase: 13.5, fill: "#0B1710",
    trees: { spacing: 24, height: 54, kind: "scrub" } },
];

const SUN_X_FRAC = 0.74;
const SUN_Y_FRAC = 0.60;

/** Deterministic 0..1 hash — keeps tree placement stable across frames and reloads. */
function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}

/** Endless, seam-free terrain profile: a sum of three sines evaluated in world space. */
function ridgeY(layer: Layer, worldX: number, h: number): number {
  const [a1, a2, a3] = layer.amps;
  const [f1, f2, f3] = layer.freqs;
  return (
    layer.yBase * h +
    a1 * Math.sin(worldX * f1 + layer.phase) +
    a2 * Math.sin(worldX * f2 + layer.phase * 1.7) +
    a3 * Math.sin(worldX * f3 + layer.phase * 2.9)
  );
}

export default function TrailScene({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(0);        // -1..1, subtle vertical drift from the cursor
  const scrollRef = useRef(0);         // extra distance contributed by page scroll

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

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawSky(h: number, w: number) {
      const g = ctx!.createLinearGradient(0, 0, 0, h * 0.98);
      for (const [stop, color] of SKY_STOPS) g.addColorStop(stop, color);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);
    }

    function drawSun(w: number, h: number, t: number) {
      const cx = w * SUN_X_FRAC;
      const cy = h * SUN_Y_FRAC + Math.sin(t * 0.00008) * 4;
      const r = Math.max(26, Math.min(w, h) * 0.045);

      const glow = ctx!.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 13);
      glow.addColorStop(0, "rgba(255, 228, 176, 0.70)");
      glow.addColorStop(0.28, "rgba(249, 194, 136, 0.28)");
      glow.addColorStop(0.62, "rgba(226, 150, 120, 0.10)");
      glow.addColorStop(1, "rgba(246, 197, 138, 0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 13, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = "#FFF1D2";
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawStars(w: number, h: number, t: number) {
      ctx!.save();
      for (let i = 0; i < 70; i++) {
        const x = hash(i * 2.3) * w;
        const y = hash(i * 7.7) * h * 0.42;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.0012 + i));
        ctx!.globalAlpha = tw * 0.5 * (1 - y / (h * 0.45));
        ctx!.fillStyle = "#FFFFFF";
        ctx!.fillRect(x, y, 1.4, 1.4);
      }
      ctx!.restore();
    }

    function drawClouds(w: number, h: number, dist: number, t: number) {
      ctx!.save();
      for (let band = 0; band < 3; band++) {
        const speed = 0.010 + band * 0.007;
        const yy = h * (0.20 + band * 0.10);
        const scale = 1 + band * 0.55;
        // Lower bands sit nearer the sun, so they catch more of its colour.
        const warm = band === 2 ? [250, 214, 170] : band === 1 ? [226, 202, 196] : [198, 200, 212];
        const span = 560 * scale;
        const offset = (dist * speed + t * 0.005) % span;
        for (let k = -1; k < Math.ceil(w / span) + 2; k++) {
          const bx = k * span - offset;
          const seed = band * 31 + k * 7;
          for (let p = 0; p < 4; p++) {
            const px = bx + p * 52 * scale + hash(seed + p) * 34;
            const py = yy + Math.sin(p * 1.3 + band) * 8;
            const pr = (26 + hash(seed + p * 3) * 30) * scale;
            const alpha = (0.10 + band * 0.05) * (0.45 + hash(seed + p * 5) * 0.55);
            const g = ctx!.createRadialGradient(px, py, 0, px, py, pr);
            g.addColorStop(0, `rgba(${warm[0]}, ${warm[1]}, ${warm[2]}, ${alpha})`);
            g.addColorStop(0.55, `rgba(${warm[0]}, ${warm[1]}, ${warm[2]}, ${alpha * 0.45})`);
            g.addColorStop(1, `rgba(${warm[0]}, ${warm[1]}, ${warm[2]}, 0)`);
            ctx!.fillStyle = g;
            ctx!.beginPath();
            ctx!.ellipse(px, py, pr * 1.35, pr * 0.30, 0, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }
      ctx!.restore();
    }

    function drawTree(
      x: number,
      groundY: number,
      size: number,
      kind: "cypress" | "pine" | "scrub",
      sway: number,
      color: string
    ) {
      ctx!.fillStyle = color;
      if (kind === "cypress") {
        // Tall, narrow, slightly leaning — the shape that reads as Israel.
        const w = size * 0.20;
        ctx!.beginPath();
        ctx!.moveTo(x - w, groundY);
        ctx!.quadraticCurveTo(x - w * 0.85 + sway * 0.4, groundY - size * 0.55, x + sway, groundY - size);
        ctx!.quadraticCurveTo(x + w * 0.85 + sway * 0.4, groundY - size * 0.55, x + w, groundY);
        ctx!.closePath();
        ctx!.fill();
      } else if (kind === "pine") {
        const w = size * 0.55;
        for (let tier = 0; tier < 3; tier++) {
          const ty = groundY - size * (0.30 + tier * 0.26);
          const tw = w * (1 - tier * 0.24);
          ctx!.beginPath();
          ctx!.moveTo(x - tw + sway * tier * 0.3, ty);
          ctx!.lineTo(x + sway * (tier + 1) * 0.3, ty - size * 0.34);
          ctx!.lineTo(x + tw + sway * tier * 0.3, ty);
          ctx!.closePath();
          ctx!.fill();
        }
        ctx!.fillRect(x - size * 0.045, groundY - size * 0.34, size * 0.09, size * 0.34);
      } else {
        // Foreground scrub — a fan of grass blades that catch the wind.
        for (let b = 0; b < 5; b++) {
          const bx = x + (b - 2) * size * 0.11;
          const bh = size * (0.55 + hash(x + b) * 0.6);
          const lean = sway * (1 + b * 0.18);
          ctx!.beginPath();
          ctx!.moveTo(bx - size * 0.035, groundY);
          ctx!.quadraticCurveTo(bx + lean * 0.5, groundY - bh * 0.6, bx + lean, groundY - bh);
          ctx!.quadraticCurveTo(bx + lean * 0.4, groundY - bh * 0.55, bx + size * 0.035, groundY);
          ctx!.closePath();
          ctx!.fill();
        }
      }
    }

    function drawLayer(layer: Layer, w: number, h: number, dist: number, t: number, bob: number) {
      const worldOffset = dist * layer.depth;
      const step = layer.depth > 0.8 ? 6 : 10;

      ctx!.fillStyle = layer.fill;
      ctx!.beginPath();
      ctx!.moveTo(0, h + 4);
      for (let sx = 0; sx <= w + step; sx += step) {
        const wx = sx + worldOffset;
        const y = ridgeY(layer, wx, h) + bob * layer.depth;
        ctx!.lineTo(sx, y);
      }
      ctx!.lineTo(w + step, h + 4);
      ctx!.closePath();
      ctx!.fill();

      // Backlit ridges catch a thread of sun along their crest — brightest
      // directly beneath the disc, fading out to either side.
      if (layer.depth <= 0.7) {
        const sunX = w * SUN_X_FRAC;
        const rim = ctx!.createLinearGradient(sunX - w * 0.55, 0, sunX + w * 0.55, 0);
        const strength = 0.42 * (1 - layer.depth / 0.9);
        rim.addColorStop(0, "rgba(255, 224, 176, 0)");
        rim.addColorStop(0.5, `rgba(255, 226, 180, ${strength.toFixed(3)})`);
        rim.addColorStop(1, "rgba(255, 224, 176, 0)");
        ctx!.strokeStyle = rim;
        ctx!.lineWidth = 1.6;
        ctx!.beginPath();
        for (let sx = 0; sx <= w + step; sx += step) {
          const wx = sx + worldOffset;
          const y = ridgeY(layer, wx, h) + bob * layer.depth;
          if (sx === 0) ctx!.moveTo(sx, y);
          else ctx!.lineTo(sx, y);
        }
        ctx!.stroke();
      }

      if (!layer.trees) return;
      const { spacing, height: th, kind } = layer.trees;
      const first = Math.floor(worldOffset / spacing) - 1;
      const last = Math.ceil((worldOffset + w) / spacing) + 1;
      for (let i = first; i <= last; i++) {
        const wx = i * spacing + hash(i * 1.37) * spacing * 0.55;
        const sx = wx - worldOffset;
        if (sx < -80 || sx > w + 80) continue;
        const gy = ridgeY(layer, wx, h) + bob * layer.depth + 1;
        const scale = 0.62 + hash(i * 3.11) * 0.72;
        const sway = Math.sin(t * 0.0011 + i * 0.9) * (kind === "scrub" ? 4.5 : 1.8) * layer.depth;
        drawTree(sx, gy, th * scale, kind, sway, layer.fill);
      }
    }

    function drawBirds(w: number, h: number, dist: number, t: number) {
      ctx!.save();
      ctx!.strokeStyle = "rgba(30, 40, 46, 0.5)";
      ctx!.lineWidth = 1.4;
      ctx!.lineCap = "round";
      for (let i = 0; i < 5; i++) {
        const span = 1400;
        const bx = ((i * 317 + t * 0.02 + dist * 0.05) % span) - 120;
        const by = h * (0.20 + hash(i * 5.5) * 0.16) + Math.sin(t * 0.0009 + i) * 10;
        const flap = Math.sin(t * 0.008 + i * 2) * 3.2;
        const s = 4 + hash(i * 9.1) * 3;
        ctx!.beginPath();
        ctx!.moveTo(bx - s, by + flap);
        ctx!.quadraticCurveTo(bx, by - flap * 0.6, bx + s, by + flap);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawMotes(w: number, h: number, dist: number, t: number) {
      ctx!.save();
      for (let i = 0; i < 34; i++) {
        const span = 900;
        const mx = ((hash(i * 4.4) * span + dist * 0.9 * -1) % span + span) % span;
        const x = (mx / span) * (w + 120) - 60;
        const drift = Math.sin(t * 0.0006 + i * 1.7) * 22;
        const y = h * (0.55 + hash(i * 8.8) * 0.42) + drift;
        const r = 0.9 + hash(i * 2.2) * 1.9;
        ctx!.globalAlpha = 0.18 + 0.32 * Math.abs(Math.sin(t * 0.0011 + i));
        ctx!.fillStyle = "#FFE9C4";
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawHaze(w: number, h: number) {
      // Warm atmospheric band that fades in and out — a hard-edged rect here
      // left a visible seam across the horizon.
      const g = ctx!.createLinearGradient(0, h * 0.38, 0, h * 0.96);
      g.addColorStop(0.00, "rgba(246, 205, 158, 0)");
      g.addColorStop(0.42, "rgba(246, 205, 158, 0.26)");
      g.addColorStop(0.72, "rgba(246, 205, 158, 0.10)");
      g.addColorStop(1.00, "rgba(246, 205, 158, 0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, h * 0.38, w, h * 0.58);
    }

    function frame(now: number) {
      if (!running) return;
      const elapsed = now - startedAt;

      // Walking speed, in world units per millisecond.
      const base = 0.055;
      // The first ~2.4s reads as turning your head to look out across the valley,
      // then easing into a steady walking pace.
      const settle = reduced ? 1 : 1 + 3.2 * Math.pow(1 - Math.min(elapsed / 2400, 1), 3);
      const dist = (reduced ? 8000 : elapsed * base * settle) + scrollRef.current * 0.55;

      // Stride bob — two footfalls per cycle, small enough to feel rather than see.
      const bob = reduced ? 0 : Math.sin(elapsed * 0.0042) * 2.4 + pointerRef.current * 7;

      drawSky(height, width);
      if (!reduced) drawStars(width, height, elapsed);
      else drawStars(width, height, 0);
      drawSun(width, height, elapsed);
      drawClouds(width, height, dist, elapsed);
      drawHaze(width, height);
      drawBirds(width, height, dist, elapsed);

      for (const layer of LAYERS) drawLayer(layer, width, height, dist, elapsed, bob);

      drawMotes(width, height, dist, elapsed);

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
      style={{ display: "block", width: "100%", height: "100%", background: "#1E3550" }}
    />
  );
}
