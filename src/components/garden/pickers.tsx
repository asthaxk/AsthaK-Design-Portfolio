"use client";

import {
  BUSHES,
  COLOURS,
  FLOWERS,
  POTS,
  bitmapColour,
  type Bitmap,
  type FlowerId,
} from "./sprites";
import { FlowerIcon } from "./flower-icon";
import { PixelDisc } from "./pixel-disc";

/** Any scenery bitmap, rendered crisp at a given height. */
function BitmapIcon({ item, height }: { item: Bitmap; height: number }) {
  return (
    <svg
      viewBox={`0 0 ${item.w} ${item.h}`}
      width={(height * item.w) / item.h}
      height={height}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {item.rows.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const fill = bitmapColour(item, ch);
          return fill ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null;
        }),
      )}
    </svg>
  );
}

function Swatch({
  active,
  onClick,
  title,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`flex h-[34px] min-w-[34px] items-center justify-center gap-1 rounded-[7px] border px-1 transition-colors ${
        active
          ? "border-ink bg-white"
          : "border-ink/15 bg-white/60 hover:border-ink/40"
      }`}
    >
      {children}
      {label ? (
        <span className="font-pixel text-[8px] text-ink">{label}</span>
      ) : null}
    </button>
  );
}

/** One labelled row of the builder. */
export function BuilderRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="font-pixel text-[9px] text-[#fdf3e3]">{label}</span>
      <div className="flex items-center gap-[5px]">{children}</div>
    </div>
  );
}

export function FlowerPicker({
  value,
  colour,
  active,
  onChange,
}: {
  value: FlowerId;
  colour: string;
  active: boolean;
  onChange: (id: FlowerId) => void;
}) {
  return (
    <>
      {FLOWERS.map((f) => (
        <Swatch
          key={f.id}
          active={active && f.id === value}
          onClick={() => onChange(f.id)}
          title={f.name}
        >
          <FlowerIcon flower={f.id} colour={colour} size={22} />
        </Swatch>
      ))}
    </>
  );
}

export function PotPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <>
      <Swatch
        active={value === null}
        onClick={() => onChange(null)}
        title="Plant straight into the soil"
        label="none"
      >
        {null}
      </Swatch>
      {POTS.map((pot, i) => (
        <Swatch
          key={pot.name}
          active={value === i}
          onClick={() => onChange(i)}
          title={pot.name}
        >
          <BitmapIcon item={pot} height={16} />
        </Swatch>
      ))}
    </>
  );
}

export function BushPicker({
  value,
  active,
  onChange,
}: {
  value: number;
  active: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <>
      {BUSHES.map((bush, i) => (
        <Swatch
          key={bush.name}
          active={active && value === i}
          onClick={() => onChange(i)}
          title={bush.name}
        >
          <BitmapIcon item={bush} height={18} />
        </Swatch>
      ))}
    </>
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
    <div className="grid grid-cols-9 gap-[4px]">
      {COLOURS.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-pressed={active}
            aria-label={`Colour ${c}`}
            className={`flex size-[15px] items-center justify-center transition-transform ${
              active ? "scale-125" : "hover:scale-110"
            }`}
          >
            <PixelDisc fill={c} size={active ? 13 : 11} />
          </button>
        );
      })}
    </div>
  );
}
