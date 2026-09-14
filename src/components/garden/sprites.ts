/**
 * Flower sprites as pixel bitmaps — one source of truth shared by the picker
 * icons (SVG) and the garden canvas (Pixi).
 *
 *   .  transparent      p  petal (player-chosen colour)
 *   C  bright centre    c  dark centre
 *   s  stem             L  leaf
 */
export type FlowerId = "daisy" | "tulip" | "poppy" | "bell" | "sprout";

export const STEM = "#3a7d44";
export const LEAF = "#52b788";
export const CENTRE_BRIGHT = "#ffd166";
export const CENTRE_DARK = "#2b1a0a";

export const FLOWERS: { id: FlowerId; name: string; rows: string[] }[] = [
  {
    id: "daisy",
    name: "Daisy",
    rows: [
      "..ppp..",
      ".ppppp.",
      "ppCCCpp",
      ".ppppp.",
      "..ppp..",
      "...s...",
      "..Ls...",
      "...sL..",
      "...s...",
      "...s...",
    ],
  },
  {
    id: "tulip",
    name: "Tulip",
    rows: [
      ".p...p.",
      ".pp.pp.",
      ".ppppp.",
      ".ppppp.",
      "..ppp..",
      "...s...",
      "..Ls...",
      "...sL..",
      "...s...",
      "...s...",
    ],
  },
  {
    id: "poppy",
    name: "Poppy",
    rows: [
      ".ppppp.",
      "ppppppp",
      "ppcCcpp",
      "ppppppp",
      ".ppppp.",
      "...s...",
      "..Ls...",
      "...sL..",
      "...s...",
      "...s...",
    ],
  },
  {
    id: "bell",
    name: "Bell",
    rows: [
      "..ppp..",
      "..ppp..",
      ".ppppp.",
      ".ppppp.",
      "..p.p..",
      "...s...",
      "..Ls...",
      "...sL..",
      "...s...",
      "...s...",
    ],
  },
  {
    id: "sprout",
    name: "Sprout",
    rows: [
      ".......",
      ".......",
      "..ppp..",
      ".pp.pp.",
      "..psp..",
      "...s...",
      "..Ls...",
      "...sL..",
      "...s...",
      "...s...",
    ],
  },
];

export const SPRITE_W = 7;
export const SPRITE_H = 10;

/** Resolve a bitmap char to a colour, or null for transparent. */
export function charColour(ch: string, petal: string): string | null {
  switch (ch) {
    case "p":
      return petal;
    case "C":
      return CENTRE_BRIGHT;
    case "c":
      return CENTRE_DARK;
    case "s":
      return STEM;
    case "L":
      return LEAF;
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
