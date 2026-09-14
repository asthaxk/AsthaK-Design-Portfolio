import { DISC_9 } from "./sprites";

/** A 9x9 chunky disc — square pixels rather than a smooth CSS circle. */
export function PixelDisc({
  fill,
  size,
  className,
}: {
  fill: string;
  size: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 9 9"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {DISC_9.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "x" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null,
        ),
      )}
    </svg>
  );
}
