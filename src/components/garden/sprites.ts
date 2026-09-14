/**
 * Flower sprites as pixel bitmaps — one source of truth shared by the picker
 * icons (SVG) and the garden canvas (Pixi).
 *
 *   .  transparent      p  petal (player-chosen colour)
 *   C  bright centre    c  dark centre
 *   s  stem             L  leaf
 */
export type FlowerId =
  | "daisy"
  | "tulip"
  | "poppy"
  | "bell"
  | "sprout"
  | "sunflower"
  | "lavender"
  | "blossom";

export const STEM = "#7a9068";
export const LEAF = "#93aa79";
export const LEAF_LIGHT = "#b3c79c";
export const CENTRE_BRIGHT = "#ffd166";
export const CENTRE_DARK = "#2b1a0a";

export const FLOWERS: { id: FlowerId; name: string; rows: string[] }[] = [
  {
    id: "daisy",
    name: "Daisy",
    rows: [
      "..ppp..",
      ".phppp.",
      "ppCCCpp",
      "ppCCCpp",
      ".ppppp.",
      "..ppp..",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
    ],
  },
  {
    id: "tulip",
    name: "Tulip",
    rows: [
      "..p.p..",
      ".ppppp.",
      ".phppp.",
      ".ppppp.",
      ".ppppp.",
      "..ppp..",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
    ],
  },
  {
    id: "poppy",
    name: "Poppy",
    rows: [
      "..ppp..",
      ".phppp.",
      "ppppppp",
      "pppcppp",
      ".ppppp.",
      "..ppp..",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
    ],
  },
  {
    id: "bell",
    name: "Bell",
    rows: [
      "...s...",
      "..ppp..",
      ".phppp.",
      ".ppppp.",
      ".ppppp.",
      "..ppp..",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
    ],
  },
  {
    id: "sunflower",
    name: "Sunflower",
    rows: [
      "..p.p..",
      ".ppppp.",
      "ppcccpp",
      "ppcccpp",
      ".ppppp.",
      "..p.p..",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
    ],
  },
  {
    id: "lavender",
    name: "Lavender",
    rows: [
      "...p...",
      "..php..",
      "...p...",
      "..ppp..",
      "...p...",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
      "...s...",
    ],
  },
  {
    id: "blossom",
    name: "Blossom",
    rows: [
      "..p.p..",
      ".ppppp.",
      "..pCp..",
      ".ppppp.",
      "..p.p..",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
      "...s...",
    ],
  },
  {
    id: "sprout",
    name: "Sprout",
    rows: [
      ".......",
      "..ppp..",
      ".phppp.",
      "..ppp..",
      "..LsL..",
      ".LLsLL.",
      "...s...",
      ".lLs...",
      "...sLl.",
      "...s...",
    ],
  },
];

export const SPRITE_W = 7;
export const SPRITE_H = 10;

/** Resolve a bitmap char to a colour, or null for transparent. */
/** Mix a colour toward white — used for the highlight pixel on each bloom. */
export function lighten(hex: string, amount = 0.42): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function charColour(ch: string, petal: string): string | null {
  switch (ch) {
    case "p":
      return petal;
    case "h":
      return lighten(petal);
    case "C":
      return CENTRE_BRIGHT;
    case "c":
      return CENTRE_DARK;
    case "s":
      return STEM;
    case "L":
      return LEAF;
    case "l":
      return LEAF_LIGHT;
    default:
      return null;
  }
}

/** 18 petal colours — two columns of nine, echoing the logo's bloom. */
export const COLOURS = [
  "#f72585", "#ff4d6d",
  "#b5179e", "#ff7b9c",
  "#7209b7", "#ffa5ab",
  "#3a0ca3", "#ffd6e0",
  "#4361ee", "#e63946",
  "#4cc9f0", "#d62828",
  "#90e0ef", "#f77f00",
  "#e9edc9", "#fcbf49",
  "#fffaf0", "#ffd166",
];

/** A chunky 9x9 disc, so swatches read as pixel art rather than CSS circles. */
export const DISC_9 = [
  "..xxxxx..",
  ".xxxxxxx.",
  "xxxxxxxxx",
  "xxxxxxxxx",
  "xxxxxxxxx",
  "xxxxxxxxx",
  "xxxxxxxxx",
  ".xxxxxxx.",
  "..xxxxx..",
];

/**
 * Scenery bitmaps — pots and bushes. Unlike flowers, which take the visitor's
 * chosen colour, each of these carries its own palette, so a variant is a
 * bitmap plus a colour map and nothing else.
 */
export type Bitmap = {
  name: string;
  w: number;
  h: number;
  rows: string[];
  palette: Record<string, string>;
};

/** Every pot is the same terracotta; they differ by silhouette alone. */
const TERRACOTTA = {
  r: "#9a5233", // rim and outline
  b: "#b96a44", // body
  g: "#d18a63", // highlight
  k: "#7f4227", // shadowed base
};
const LEAVES = { d: "#6b8f5a", m: "#86a86b", l: "#a3c285" };

export const POTS: Bitmap[] = [
  {
    name: "Classic",
    w: 7,
    h: 5,
    rows: ["rrrrrrr", ".bgbbb.", ".bbbbb.", "..bbb..", "..kkk.."],
    palette: TERRACOTTA,
  },
  {
    name: "Tall",
    w: 5,
    h: 7,
    rows: ["rrrrr", "bgbbb", "bbbbb", "bbbbb", ".bbb.", ".bbb.", ".kkk."],
    palette: TERRACOTTA,
  },
  {
    name: "Bowl",
    w: 9,
    h: 4,
    rows: ["rrrrrrrrr", ".bgbbbbb.", "..bbbbb..", "...kkk..."],
    palette: TERRACOTTA,
  },
  {
    name: "Square",
    w: 7,
    h: 5,
    rows: ["rrrrrrr", "bbbgbbb", "bbbbbbb", "bbbbbbb", ".kkkkk."],
    palette: TERRACOTTA,
  },
];

export const BUSHES: Bitmap[] = [
  {
    name: "Shrub",
    w: 9,
    h: 7,
    rows: [
      "..d.d.d..",
      ".dmdmdmd.",
      "dmmmmmmmd",
      "dmmlmmmmd",
      ".dmmmmmd.",
      "..dmmmd..",
      "...ddd...",
    ],
    palette: LEAVES,
  },
  {
    name: "Sprig",
    w: 7,
    h: 6,
    rows: ["..d.d..", ".dmdmd.", "dmmmmmd", "dmmlmmd", ".dmmmd.", "..ddd.."],
    palette: LEAVES,
  },
  {
    name: "Berry",
    w: 7,
    h: 7,
    rows: [
      "..d.d..",
      ".dmdmd.",
      "dmBmmmd",
      "dmmmBmd",
      "dmBmmmd",
      ".dmmmd.",
      "..ddd..",
    ],
    palette: { ...LEAVES, B: "#c94f6d" },
  },
  {
    name: "Spire",
    w: 5,
    h: 8,
    rows: ["..d..", ".dmd.", "dmmmd", "dmlmd", "dmmmd", ".dmd.", "..d..", "..d.."],
    palette: LEAVES,
  },
];

/** Resolve a scenery char against that item's own palette. */
export function bitmapColour(item: Bitmap, ch: string): string | null {
  return item.palette[ch] ?? null;
}
