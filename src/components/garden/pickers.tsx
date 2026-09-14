"use client";

import { COLOURS, FLOWERS, type FlowerId } from "./sprites";
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
