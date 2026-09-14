"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";
import {
  FLOWERS,
  SPRITE_H,
  SPRITE_W,
  charColour,
  type FlowerId,
} from "./sprites";

/**
 * The garden is rendered at a small internal resolution and upscaled by CSS
 * with image-rendering: pixelated, so every pixel stays square and crisp.
 * All numbers below are in that internal pixel space.
 */
const GW = 362;
const GH = 158;

/**
 * Two ground plans, both 362x158 in internal pixels. Each returns the left and
 * right edge of the plane at depth t, where 0 is the back and 1 the front —
 * everything else in the garden is expressed against these edges, so a new
 * shape needs nothing but a new entry here.
 */
export type PlaneId = "trapezoid" | "wedge";

const PLANES: Record<PlaneId, (t: number) => { left: number; right: number }> = {
  // Symmetric: both edges converge toward the back.
  trapezoid: (t) => {
    const half = 71 + (181 - 71) * t;
    const cx = 167 + (181 - 167) * t;
    return { left: cx - half, right: cx + half };
  },
  // Figma "M298 0 H483 V209.5 H0 L298 0 Z" scaled to the internal plane: the
  // right edge stays vertical while the left edge recedes on the diagonal.
  wedge: (t) => ({ left: 223.4 * (1 - t), right: 362 }),
};

const ROWS = 12;
const COLS = 20;
/** Each sprite pixel covers this many canvas pixels, keeping flowers chunky. */
const UNIT = 2;

const GRASS_BASE = "#aebb96";
const GRASS_LIGHT = "#c2cdac";
const GRASS_DARK = "#a3b18a";

const GROW_MS = 450;

/**
 * The breeze arrives in gusts rather than blowing constantly — a gust every
 * BREEZE_PERIOD_MS, easing in and out over BREEZE_GUST_MS, with the rest of
 * the cycle still. Amplitude is tiny and the shift is rounded to whole pixels,
 * because sub-pixel motion would smear the pixel art.
 */
const BREEZE_PERIOD_MS = 9000;
const BREEZE_GUST_MS = 3600;
const BREEZE_AMP = 1.7;

/** How far a flower leans right now, in whole pixels at the top of its stem. */
function breezeAt(now: number, x: number, jitter: number): number {
  const phase = now % BREEZE_PERIOD_MS;
  if (phase > BREEZE_GUST_MS) return 0;
  // Ease the gust in and out so it never starts or stops abruptly.
  const envelope = Math.sin((Math.PI * phase) / BREEZE_GUST_MS);
  // Subtracting x makes the gust travel across the garden rather than hit
  // every flower at once.
  const wave = Math.sin(phase / 190 - x * 0.035 + jitter);
  return BREEZE_AMP * envelope * wave;
}

type Plant = {
  flower: FlowerId;
  colour: string;
  /** Cell centre in internal pixel space. */
  x: number;
  y: number;
  /** Depth 0 (back) to 1 (front) — drives draw order. */
  t: number;
  plantedAt: number;
  /** Per-flower phase offset, so a gust does not move them in lockstep. */
  jitter: number;
};

/** Left/right edges of the chosen plane at depth t. */
function edgesAt(t: number, plane: PlaneId) {
  return PLANES[plane](t);
}

function drawGround(g: Graphics, plane: PlaneId) {
  g.clear();
  for (let r = 0; r < ROWS; r++) {
    const t0 = r / ROWS;
    const t1 = (r + 1) / ROWS;
    const a = edgesAt(t0, plane);
    const b = edgesAt(t1, plane);
    const y0 = Math.round(t0 * GH);
    const y1 = Math.round(t1 * GH);

    g.poly([a.left, y0, a.right, y0, b.right, y1, b.left, y1]).fill(
      r % 2 === 0 ? GRASS_BASE : GRASS_DARK,
    );

    // Scattered specks give the turf some pixel-art texture.
    const speckles = 4 + r;
    for (let s = 0; s < speckles; s++) {
      const f = (s * 7919 + r * 104729) % 1000 / 1000;
      const y = y0 + ((y1 - y0) * ((s * 31 + r * 17) % 10)) / 10;
      const tt = y / GH;
      const e = edgesAt(tt, plane);
      const x = Math.round(e.left + (e.right - e.left) * f);
      g.rect(x, Math.round(y), 1, 1).fill(
        s % 2 === 0 ? GRASS_LIGHT : GRASS_DARK,
      );
    }
  }
}

function drawPlants(g: Graphics, plants: Plant[], now: number) {
  g.clear();
  // Back to front, so nearer flowers overlap further ones.
  const ordered = [...plants].sort((p, q) => p.t - q.t);

  for (const p of ordered) {
    const rows = FLOWERS.find((f) => f.id === p.flower)?.rows;
    if (!rows) continue;

    // Grow upward from the soil.
    const progress = Math.min(1, (now - p.plantedAt) / GROW_MS);
    const visible = Math.ceil(progress * SPRITE_H);

    const originX = Math.round(p.x - (SPRITE_W * UNIT) / 2);
    const originY = Math.round(p.y - SPRITE_H * UNIT);
    const lean = breezeAt(now, p.x, p.jitter);

    for (let ry = SPRITE_H - 1; ry >= SPRITE_H - visible; ry--) {
      const line = rows[ry];
      // The base is rooted; the further up the stem, the more it leans.
      const weight = (SPRITE_H - 1 - ry) / (SPRITE_H - 1);
      const shift = Math.round(lean * weight) * UNIT;
      for (let rx = 0; rx < SPRITE_W; rx++) {
        const colour = charColour(line[rx], p.colour);
        if (!colour) continue;
        g.rect(
          originX + rx * UNIT + shift,
          originY + ry * UNIT,
          UNIT,
          UNIT,
        ).fill(colour);
      }
    }
  }
}


/**
 * A garden that starts empty looks broken, so it opens already planted.
 * Clusters are hand-placed in grid space — each is one flower type in a
 * narrow colour family, which is what makes a group read as a clump that
 * seeded itself rather than scattered singles.
 */
const CLUSTERS: {
  flower: FlowerId;
  colours: string[];
  cells: [row: number, col: number][];
}[] = [
  // Columns are narrower at the back of the plane, so far clusters use a
  // two-column gap and near ones a single column to clump by the same amount.
  {
    flower: "daisy",
    colours: ["#fffaf0", "#e9edc9", "#ffd166"],
    cells: [
      [2, 5],
      [2, 7],
      [3, 4],
      [3, 6],
      [4, 5],
    ],
  },
  {
    flower: "tulip",
    colours: ["#ff7b9c", "#ffa5ab", "#f72585"],
    cells: [
      [5, 15],
      [5, 17],
      [6, 14],
      [6, 16],
      [7, 15],
    ],
  },
  {
    flower: "poppy",
    colours: ["#e63946", "#d62828", "#f77f00"],
    cells: [
      [9, 3],
      [9, 5],
      [10, 2],
      [10, 4],
      [11, 3],
    ],
  },
  {
    flower: "bell",
    colours: ["#7209b7", "#4361ee", "#b5179e"],
    cells: [
      [9, 15],
      [9, 17],
      [10, 15],
      [10, 17],
      [11, 16],
    ],
  },
  {
    flower: "sprout",
    colours: ["#90e0ef", "#4cc9f0"],
    cells: [
      [7, 9],
      [7, 11],
      [8, 10],
    ],
  },
];

/** Place a flower on the perspective grid at the given row and column. */
function cellPlant(
  row: number,
  col: number,
  flower: FlowerId,
  colour: string,
  plantedAt: number,
  plane: PlaneId,
): Plant {
  const t = (row + 0.5) / ROWS;
  const e = edgesAt(t, plane);
  return {
    flower,
    colour,
    x: e.left + ((col + 0.5) / COLS) * (e.right - e.left),
    y: t * GH,
    t,
    plantedAt,
    jitter: ((row * 7 + col * 13) % 10) / 10 * Math.PI * 2,
  };
}

/** Seeded plantings, staggered so the garden grows in when the page opens. */
function seedGarden(now: number, plane: PlaneId): Plant[] {
  const out: Plant[] = [];
  let i = 0;
  for (const cluster of CLUSTERS) {
    cluster.cells.forEach(([row, col], n) => {
      out.push(
        cellPlant(
          row,
          col,
          cluster.flower,
          cluster.colours[n % cluster.colours.length],
          // A future timestamp simply delays the growth animation.
          now + i * 55,
          plane,
        ),
      );
      i++;
    });
  }
  return out;
}

export function GardenCanvas({
  flower,
  colour,
  plane = "trapezoid",
}: {
  flower: FlowerId;
  colour: string;
  plane?: PlaneId;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Kept in refs so the Pixi loop reads the latest selection without re-init.
  const selection = useRef({ flower, colour });
  selection.current = { flower, colour };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let app: Application | null = null;
    let disposed = false;
    const plants: Plant[] = [];

    (async () => {
      const instance = new Application();
      await instance.init({
        width: GW,
        height: GH,
        backgroundAlpha: 0,
        antialias: false,
        resolution: 1,
        autoDensity: false,
      });
      if (disposed) {
        instance.destroy(true);
        return;
      }
      app = instance;

      const canvas = instance.canvas;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.display = "block";
      canvas.style.imageRendering = "pixelated";
      canvas.style.cursor = "crosshair";
      host.appendChild(canvas);

      const scene = new Container();
      instance.stage.addChild(scene);

      plants.push(...seedGarden(performance.now(), plane));

      const ground = new Graphics();
      const flowersLayer = new Graphics();
      scene.addChild(ground, flowersLayer);
      drawGround(ground, plane);

      const plant = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * GW;
        const y = ((event.clientY - rect.top) / rect.height) * GH;
        if (y < 0 || y > GH) return;

        const t = y / GH;
        const { left, right } = edgesAt(t, plane);
        if (x < left || x > right) return; // outside the plane

        // Snap to the perspective grid so plantings sit on the ground.
        const row = Math.min(ROWS - 1, Math.floor(t * ROWS));
        const rowT = (row + 0.5) / ROWS;
        const e = edgesAt(rowT, plane);
        const col = Math.min(
          COLS - 1,
          Math.max(0, Math.floor(((x - e.left) / (e.right - e.left)) * COLS)),
        );

        plants.push({
          flower: selection.current.flower,
          colour: selection.current.colour,
          x: e.left + ((col + 0.5) / COLS) * (e.right - e.left),
          y: rowT * GH,
          t: rowT,
          plantedAt: performance.now(),
          jitter: ((col * 13 + row * 7) % 10) / 10 * Math.PI * 2,
        });
      };

      canvas.addEventListener("dblclick", plant);

      instance.ticker.add(() => {
        drawPlants(flowersLayer, plants, performance.now());
      });

      // Cleanup for the listener rides along with destroy() below.
      (instance as Application & { _detach?: () => void })._detach = () =>
        canvas.removeEventListener("dblclick", plant);
    })();

    return () => {
      disposed = true;
      if (app) {
        (app as Application & { _detach?: () => void })._detach?.();
        app.destroy(true, { children: true });
        app = null;
      }
    };
  }, [plane]);

  return <div ref={hostRef} className="w-full" />;
}
