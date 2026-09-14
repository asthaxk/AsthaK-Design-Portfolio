/**
 * Hand-drawn pixel glyphs standing in for emoji, so the page's small icons
 * share the garden's visual language instead of rendering as the viewer's
 * system emoji font — which differs per platform and is not pixel art.
 *
 * Same bitmap-plus-palette shape as the garden sprites.
 */
type Glyph = { w: number; h: number; rows: string[]; palette: Record<string, string> };

const GLYPHS: Record<string, Glyph> = {
  // Laptop — hiring
  laptop: {
    w: 11,
    h: 8,
    rows: [
      "...........",
      "..fffffff..",
      "..fsssssf..",
      "..fsssssf..",
      "..fffffff..",
      ".bbbbbbbbb.",
      "bbbbbbbbbbb",
      "...........",
    ],
    palette: { f: "#3f4a5a", s: "#8ecae6", b: "#9aa7b5" },
  },
  // Four-leaf clover — mentoring
  clover: {
    w: 9,
    h: 9,
    rows: [
      "..g...g..",
      ".ggg.ggg.",
      ".ggg.ggg.",
      "..g.c.g..",
      ".ggg.ggg.",
      ".ggg.ggg.",
      "..g.s.g..",
      "....s....",
      "...ss....",
    ],
    palette: { g: "#4caf50", c: "#2e7d32", s: "#2e7d32" },
  },
  // Pen — advocating
  pen: {
    w: 9,
    h: 9,
    rows: [
      "......nn.",
      ".....nnn.",
      "....nnb..",
      "...nnb...",
      "..nnb....",
      ".nnb.....",
      "ttb......",
      "tt.......",
      ".........",
    ],
    palette: { n: "#2b6cb0", b: "#1a365d", t: "#dfe6ee" },
  },
  // Cutting-chai glass — there is no such emoji, so it is drawn
  chai: {
    w: 9,
    h: 10,
    rows: [
      "..s...s..",
      "...s.s...",
      ".........",
      ".ggggggg.",
      ".gcccccg.",
      ".gcccccg.",
      ".gcccccg.",
      "..gcccg..",
      "..ggggg..",
      "...ggg...",
    ],
    palette: { g: "#c7d2dc", c: "#b06b3a", s: "#c7d2dc" },
  },
  // Rose — the footer tagline
  rose: {
    w: 9,
    h: 9,
    rows: [
      "...ppp...",
      "..ppppp..",
      "..pdddp..",
      "..ppppp..",
      "...ppp...",
      "....s....",
      "..L.s.L..",
      "....s....",
      "....s....",
    ],
    palette: { p: "#e11d48", d: "#9f1239", s: "#15803d", L: "#22c55e" },
  },
};

export type PixelEmojiName = keyof typeof GLYPHS;

export function PixelEmoji({
  name,
  size = 18,
  className = "",
}: {
  name: PixelEmojiName;
  size?: number;
  className?: string;
}) {
  const g = GLYPHS[name];
  return (
    <svg
      viewBox={`0 0 ${g.w} ${g.h}`}
      height={size}
      width={(size * g.w) / g.h}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      // Sits on the text baseline like an emoji would.
      className={`inline-block align-[-0.2em] ${className}`}
    >
      {g.rows.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = g.palette[ch];
          return fill ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null;
        }),
      )}
    </svg>
  );
}
