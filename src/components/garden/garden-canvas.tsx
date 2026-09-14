"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";
import { breezeAt } from "./breeze";
import {
  BUSHES,
  FLOWERS,
  POT,
  POT_H,
  POT_LIFT,
  POT_W,
  SPRITE_H,
  SPRITE_W,
  charColour,
  sceneryColour,
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
  potted: boolean;
  /** When set, this is scenery drawn from BUSHES rather than a flower. */
  bush?: number;
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

/** Blit one bitmap, revealing rows from the bottom and leaning with the wind. */
function drawSprite(
  g: Graphics,
  rows: string[],
  w: number,
  h: number,
  originX: number,
  originY: number,
  visibleRows: number,
  lean: number,
  resolve: (ch: string) => string | null,
) {
  for (let ry = h - 1; ry >= h - visibleRows; ry--) {
    const line = rows[ry];
    // The base is rooted; the further up, the more it leans.
    const weight = (h - 1 - ry) / (h - 1);
    const shift = Math.round(lean * weight) * UNIT;
    for (let rx = 0; rx < w; rx++) {
      const colour = resolve(line[rx]);
      if (!colour) continue;
      g.rect(originX + rx * UNIT + shift, originY + ry * UNIT, UNIT, UNIT).fill(
        colour,
      );
    }
  }
}

function drawPlants(g: Graphics, plants: Plant[], now: number) {
  g.clear();
  // Back to front, so nearer flowers overlap further ones.
  const ordered = [...plants].sort((p, q) => p.t - q.t);

  for (const p of ordered) {
    const progress = Math.min(1, (now - p.plantedAt) / GROW_MS);
    if (progress <= 0) continue; // still waiting its turn to grow in

    if (p.bush !== undefined) {
      const bush = BUSHES[p.bush];
      drawSprite(
        g,
        bush.rows,
        bush.w,
        bush.h,
        Math.round(p.x - (bush.w * UNIT) / 2),
        Math.round(p.y - bush.h * UNIT),
        Math.ceil(progress * bush.h),
        // Bushes are dense and low, so they barely move.
        breezeAt(now, p.x, p.jitter) * 0.4,
        sceneryColour,
      );
      continue;
    }

    const rows = FLOWERS.find((f) => f.id === p.flower)?.rows;
    if (!rows) continue;

    // A potted flower sits up on the rim rather than in the soil.
    const lift = p.potted ? POT_LIFT * UNIT : 0;
    drawSprite(
      g,
      rows,
      SPRITE_W,
      SPRITE_H,
      Math.round(p.x - (SPRITE_W * UNIT) / 2),
      Math.round(p.y - SPRITE_H * UNIT) - lift,
      Math.ceil(progress * SPRITE_H),
      breezeAt(now, p.x, p.jitter),
      (ch) => charColour(ch, p.colour),
    );

    if (p.potted) {
      // Drawn after the flower so the rim occludes the base of the stem.
      drawSprite(
        g,
        POT,
        POT_W,
        POT_H,
        Math.round(p.x - (POT_W * UNIT) / 2),
        Math.round(p.y - POT_H * UNIT),
        POT_H,
        0,
        sceneryColour,
      );
    }
  }
}


/**
 * A garden that starts empty looks broken, so it opens already planted.
 *
 * Each cluster is one flower type in a narrow colour family — that is what
 * makes a group read as a clump that seeded itself rather than scattered
 * singles. Members are offset from the cluster centre in whole pixels rather
 * than grid columns: a column is much narrower at the back of the plane than
 * the front, so a column-based offset would clump far groups and scatter near
 * ones. Offsets smaller than the 14px sprite width make blooms overlap, which
 * is what actually reads as "together".
 */
const CLUSTERS: {
  flower: FlowerId;
  colours: string[];
  /** Cluster centre in grid space. */
  at: [row: number, col: number];
  /** Per-flower [row offset, x offset in pixels] from that centre. */
  members: [dRow: number, dx: number][];
}[] = [
  {
    flower: "daisy",
    colours: ["#fffaf0", "#e9edc9", "#ffd166"],
    at: [2, 6],
    members: [
      [0, 0],
      [0, -9],
      [1, -5],
      [1, 5],
      [2, -1],
    ],
  },
  {
    flower: "tulip",
    colours: ["#ff7b9c", "#ffa5ab", "#f72585"],
    at: [5, 15],
    members: [
      [0, 0],
      [0, -10],
      [1, -5],
      [1, 6],
      [2, 1],
    ],
  },
  {
    flower: "poppy",
    colours: ["#e63946", "#d62828", "#f77f00"],
    at: [9, 4],
    members: [
      [0, 0],
      [0, -10],
      [1, -6],
      [1, 5],
      [2, -2],
    ],
  },
  {
    flower: "bell",
    colours: ["#7209b7", "#4361ee", "#b5179e"],
    at: [9, 16],
    members: [
      [0, 0],
      [0, -9],
      [1, -4],
      [1, 6],
      [2, 0],
    ],
  },
  {
    flower: "sprout",
    colours: ["#90e0ef", "#4cc9f0"],
    at: [7, 10],
    members: [
      [0, 0],
      [0, -8],
      [1, -4],
    ],
  },
];

/**
 * Bushes sit along the edges the flower clusters leave bare, giving the plane
 * a border so the turf does not run flat to its outline.
 * [row, column, bush variant, x offset in pixels]
 */
const BUSHES_PLACED: [number, number, number, number][] = [
  [1, 12, 0, 0],
  [1, 17, 1, 6],
  [3, 19, 0, 10],
  [6, 19, 1, 12],
  [8, 1, 0, -6],
  [11, 3, 1, -14],
  [11, 9, 0, 4],
];

/** Place a flower on the perspective grid at the given row and column. */
function cellPlant(
  row: number,
  col: number,
  flower: FlowerId,
  colour: string,
  plantedAt: number,
  plane: PlaneId,
  dx = 0,
  opts: { potted?: boolean; bush?: number } = {},
): Plant {
  const t = (row + 0.5) / ROWS;
  const e = edgesAt(t, plane);
  return {
    flower,
    colour,
    x: e.left + ((col + 0.5) / COLS) * (e.right - e.left) + dx,
    y: t * GH,
    t,
    plantedAt,
    jitter: (((row * 7 + col * 13 + Math.round(dx)) % 10) + 10) % 10 / 10 * Math.PI * 2,
    potted: opts.potted ?? false,
    bush: opts.bush,
  };
}

/** Seeded plantings, staggered so the garden grows in when the page opens. */
function seedGarden(now: number, plane: PlaneId): Plant[] {
  const out: Plant[] = [];
  let i = 0;
  for (const [row, col, variant, dx] of BUSHES_PLACED) {
    out.push(
      cellPlant(row, col, "daisy", "#ffffff", now + i * 45, plane, dx, {
        bush: variant,
      }),
    );
    i++;
  }
  for (const cluster of CLUSTERS) {
    const [baseRow, baseCol] = cluster.at;
    cluster.members.forEach(([dRow, dx], n) => {
      out.push(
        cellPlant(
          baseRow + dRow,
          baseCol,
          cluster.flower,
          cluster.colours[n % cluster.colours.length],
          // A future timestamp simply delays the growth animation.
          now + i * 55,
          plane,
          dx,
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
  potted = false,
  plane = "trapezoid",
  onPlant,
}: {
  flower: FlowerId;
  colour: string;
  potted?: boolean;
  plane?: PlaneId;
  /** Fired with the wall-clock time whenever the visitor plants something. */
  onPlant?: (at: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Kept in refs so the Pixi loop reads the latest selection without re-init.
  const selection = useRef({ flower, colour, potted, onPlant });
  selection.current = { flower, colour, potted, onPlant };

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
          potted: selection.current.potted,
          plantedAt: performance.now(),
          jitter: ((col * 13 + row * 7) % 10) / 10 * Math.PI * 2,
        });
        selection.current.onPlant?.(Date.now());
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
