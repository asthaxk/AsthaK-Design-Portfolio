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

/** The Figma trapezoid: a perspective ground plane, narrow at the back. */
const TOP_HALF = 71;
const BOTTOM_HALF = 181;
const TOP_CX = 167;
const BOTTOM_CX = 181;

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
};

/** Left/right edges of the plane at depth t. */
function edgesAt(t: number) {
  const half = TOP_HALF + (BOTTOM_HALF - TOP_HALF) * t;
  const cx = TOP_CX + (BOTTOM_CX - TOP_CX) * t;
  return { left: cx - half, right: cx + half };
}

function drawGround(g: Graphics) {
  g.clear();
  for (let r = 0; r < ROWS; r++) {
    const t0 = r / ROWS;
    const t1 = (r + 1) / ROWS;
    const a = edgesAt(t0);
    const b = edgesAt(t1);
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
      const e = edgesAt(tt);
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

    for (let ry = SPRITE_H - 1; ry >= SPRITE_H - visible; ry--) {
      const line = rows[ry];
      for (let rx = 0; rx < SPRITE_W; rx++) {
        const colour = charColour(line[rx], p.colour);
        if (!colour) continue;
        g.rect(
          originX + rx * UNIT,
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
  {
    flower: "daisy",
    colours: ["#fffaf0", "#e9edc9", "#ffd166"],
    cells: [
      [2, 4],
      [2, 6],
      [3, 3],
      [3, 5],
      [4, 4],
    ],
  },
  {
    flower: "tulip",
    colours: ["#ff7b9c", "#ffa5ab", "#f72585"],
    cells: [
      [4, 14],
      [5, 13],
      [5, 16],
      [6, 15],
    ],
  },
  {
    flower: "poppy",
    colours: ["#e63946", "#d62828", "#f77f00"],
    cells: [
      [8, 3],
      [9, 2],
      [9, 5],
      [10, 4],
    ],
  },
  {
    flower: "bell",
    colours: ["#7209b7", "#4361ee", "#b5179e"],
    cells: [
      [9, 15],
      [10, 14],
      [10, 17],
      [11, 16],
    ],
  },
  {
    flower: "sprout",
    colours: ["#90e0ef", "#4cc9f0"],
    cells: [
      [6, 9],
      [7, 10],
      [7, 8],
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
): Plant {
  const t = (row + 0.5) / ROWS;
  const e = edgesAt(t);
  return {
    flower,
    colour,
    x: e.left + ((col + 0.5) / COLS) * (e.right - e.left),
    y: t * GH,
    t,
    plantedAt,
  };
}

/** Seeded plantings, staggered so the garden grows in when the page opens. */
function seedGarden(now: number): Plant[] {
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
}: {
  flower: FlowerId;
  colour: string;
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

      plants.push(...seedGarden(performance.now()));

      const ground = new Graphics();
      const flowersLayer = new Graphics();
      scene.addChild(ground, flowersLayer);
      drawGround(ground);

      const plant = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * GW;
        const y = ((event.clientY - rect.top) / rect.height) * GH;
        if (y < 0 || y > GH) return;

        const t = y / GH;
        const { left, right } = edgesAt(t);
        if (x < left || x > right) return; // outside the plane

        // Snap to the perspective grid so plantings sit on the ground.
        const row = Math.min(ROWS - 1, Math.floor(t * ROWS));
        const rowT = (row + 0.5) / ROWS;
        const e = edgesAt(rowT);
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
  }, []);

  return <div ref={hostRef} className="w-full" />;
}
