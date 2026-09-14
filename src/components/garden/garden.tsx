"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { COLOURS, FLOWERS, type FlowerId } from "./sprites";
import type { PlaneId } from "./garden-canvas";
import { FlowerIcon } from "./flower-icon";
import { PixelDisc } from "./pixel-disc";

// WebGL has no business running on the server.
const GardenCanvas = dynamic(
  () => import("./garden-canvas").then((m) => m.GardenCanvas),
  { ssr: false, loading: () => <div className="aspect-[362/158] w-full" /> },
);

export function Garden({ plane = "trapezoid" }: { plane?: PlaneId }) {
  const [flower, setFlower] = useState<FlowerId>("daisy");
  const [colour, setColour] = useState(COLOURS[0]);

  return (
    <div className="mx-auto w-full max-w-[720px] rounded-[12px] border-[3px] border-white bg-white/60 p-5 shadow-sticker sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-end gap-3">
            {FLOWERS.map((f) => {
              const active = f.id === flower;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFlower(f.id)}
                  aria-pressed={active}
                  title={f.name}
                  className={`flex size-[44px] items-center justify-center rounded-[8px] border-[3px] transition-transform ${
                    active
                      ? "-translate-y-[2px] border-ink bg-white"
                      : "border-white bg-white/70 hover:-translate-y-[1px]"
                  }`}
                >
                  <FlowerIcon flower={f.id} colour={colour} size={30} />
                </button>
              );
            })}
          </div>
          <p className="mt-2 font-pixel text-[11px] text-ink">Pick a flower</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="grid grid-cols-2 gap-[6px]">
            {COLOURS.map((c) => {
              const active = c === colour;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColour(c)}
                  aria-pressed={active}
                  aria-label={`Colour ${c}`}
                  className={`flex size-[18px] items-center justify-center rounded-[4px] transition-transform ${
                    active ? "scale-125" : "hover:scale-110"
                  }`}
                >
                  <PixelDisc fill={c} size={active ? 16 : 14} />
                </button>
              );
            })}
          </div>
          <p className="font-pixel [writing-mode:vertical-rl] rotate-180 text-[11px] text-ink">
            Pick a colour
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-center font-pixel text-[11px] text-ink/70">
          Double click anywhere in the garden to plant a flower
        </p>
        <GardenCanvas flower={flower} colour={colour} plane={plane} />
      </div>
    </div>
  );
}
