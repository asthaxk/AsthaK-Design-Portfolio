import { FLOWERS, SPRITE_H, SPRITE_W, charColour, type FlowerId } from "./sprites";

/** The same bitmap the canvas draws, rendered as crisp SVG for the picker. */
export function FlowerIcon({
  flower,
  colour,
  size,
}: {
  flower: FlowerId;
  colour: string;
  size: number;
}) {
  const rows = FLOWERS.find((f) => f.id === flower)?.rows ?? [];
  return (
    <svg
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      width={(size * SPRITE_W) / SPRITE_H}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = charColour(ch, colour);
          return fill ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null;
        }),
      )}
    </svg>
  );
}
