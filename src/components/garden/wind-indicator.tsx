"use client";

import { useEffect, useState } from "react";
import { gustStrength } from "./breeze";

/** Pixel streaks, the middle one hooking over — reads as moving air. */
const GUST = [
  "..xxxxxxx..",
  "...........",
  "xxxxxxxxxx.",
  ".........x.",
  "xxxxxxxxxx.",
  "...........",
  "...xxxxxx..",
];

/**
 * Fades in while a gust is blowing and out again when it passes, reading the
 * same clock as the flowers so the two always agree.
 */
export function WindIndicator({ className = "" }: { className?: string }) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setStrength(gustStrength(performance.now()));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const blowing = strength > 0.02;

  return (
    <div
      aria-hidden={!blowing}
      className={`flex items-center gap-2 transition-opacity duration-500 ${className}`}
      style={{ opacity: blowing ? 0.35 + strength * 0.65 : 0 }}
    >
      <svg
        viewBox="0 0 11 7"
        width={26}
        height={17}
        shapeRendering="crispEdges"
        aria-hidden
        style={{ transform: `translateX(${(strength * 2).toFixed(2)}px)` }}
      >
        {GUST.flatMap((row, y) =>
          [...row].map((ch, x) =>
            ch === "x" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill="currentColor"
              />
            ) : null,
          ),
        )}
      </svg>
      <span className="font-pixel text-[10px] font-bold">breezy</span>
    </div>
  );
}
