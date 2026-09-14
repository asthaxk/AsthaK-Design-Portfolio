"use client";

import { COLOURS, FLOWERS, POT, POT_H, POT_W, sceneryColour, type FlowerId } from "./sprites";
import { FlowerIcon } from "./flower-icon";
import { PixelDisc } from "./pixel-disc";

export function FlowerPicker({
  value,
  colour,
  onChange,
}: {
  value: FlowerId;
  colour: string;
  onChange: (id: FlowerId) => void;
}) {
  return (
    <div className="flex items-end gap-2">
      {FLOWERS.map((f) => {
        const active = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            aria-pressed={active}
            title={f.name}
            className={`flex size-[38px] items-center justify-center rounded-[8px] border-[3px] transition-transform ${
              active
                ? "-translate-y-[2px] border-ink bg-white"
                : "border-white bg-white/70 hover:-translate-y-[1px]"
            }`}
          >
            <FlowerIcon flower={f.id} colour={colour} size={24} />
          </button>
        );
      })}
    </div>
  );
}

export function ColourPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[5px] [max-width:200px]">
      {COLOURS.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-pressed={active}
            aria-label={`Colour ${c}`}
            className={`flex size-[16px] items-center justify-center transition-transform ${
              active ? "scale-125" : "hover:scale-110"
            }`}
          >
            <PixelDisc fill={c} size={active ? 14 : 12} />
          </button>
        );
      })}
    </div>
  );
}

/** The pot bitmap, rendered crisp for the toggle. */
function PotIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox={`0 0 ${POT_W} ${POT_H}`}
      width={size}
      height={(size * POT_H) / POT_W}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {POT.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = sceneryColour(ch);
          return fill ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null;
        }),
      )}
    </svg>
  );
}

export function PotToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      title={value ? "Planting in pots" : "Planting in soil"}
      className={`flex h-[38px] items-center gap-2 rounded-[8px] border-[3px] px-2 transition-transform ${
        value
          ? "-translate-y-[2px] border-ink bg-white"
          : "border-white bg-white/70 hover:-translate-y-[1px]"
      }`}
    >
      <span className={value ? "" : "opacity-40 grayscale"}>
        <PotIcon />
      </span>
      <span className="font-pixel text-[9px] text-ink">pot</span>
    </button>
  );
}
