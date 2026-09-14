"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { COLOURS, type FlowerId } from "./sprites";
import type { Brush } from "./garden-canvas";
import {
  BuilderRow,
  BushPicker,
  ColourPicker,
  FlowerPicker,
  PotPicker,
} from "./pickers";
import { WindIndicator } from "./wind-indicator";

const GardenCanvas = dynamic(
  () => import("./garden-canvas").then((m) => m.GardenCanvas),
  { ssr: false, loading: () => null },
);

/** "just now", then seconds, then minutes — enough for a page visit. */
function sinceLabel(at: number, now: number): string {
  const secs = Math.max(0, Math.round((now - at) / 1000));
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

function LastPlanted({ at }: { at: number | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (at === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [at]);

  // The instruction stays put; the timestamp joins it rather than replacing
  // it, so the garden never stops telling you how to use it.
  //
  // The timestamp sits in a fixed-width slot: it changes as the seconds tick
  // up, and without a reserved width the slab would resize with it and drag
  // the post along the ground.
  return (
    <p className="font-pixel text-[9px] whitespace-nowrap text-[#fdf3e3]">
      <span className="[@media(pointer:coarse)]:hidden">
        double click to plant
      </span>
      <span className="hidden [@media(pointer:coarse)]:inline">
        double tap to plant
      </span>
      <span className="ml-1 inline-block w-[92px]">
        {at === null ? "" : `· last ${sinceLabel(at, now)}`}
      </span>
    </p>
  );
}

/**
 * The zen garden as it sits on the home page: the plane bleeds into the bottom
 * right corner of the fold, with the builder stacked directly above it.
 *
 * Picking a flower or a bush also chooses what a double click places, so the
 * rows double as both palette and mode — one click, not two.
 */
export function GardenScene() {
  const [flower, setFlower] = useState<FlowerId>("daisy");
  const [colour, setColour] = useState(COLOURS[0]);
  const [pot, setPot] = useState<number | null>(null);
  const [bush, setBush] = useState(0);
  const [kind, setKind] = useState<"flower" | "bush">("flower");
  const [lastPlanted, setLastPlanted] = useState<number | null>(null);
  const [resetToken, setResetToken] = useState(0);

  const brush: Brush =
    kind === "bush" ? { kind: "bush", bush } : { kind: "flower", flower, colour, pot };

  return (
    <div
      id="garden"
      className="relative z-10 mx-auto w-full max-w-rail px-4 pb-8 sm:px-6 lg:absolute lg:right-0 lg:bottom-0 lg:mx-0 lg:w-[min(58%,660px)] lg:max-w-none lg:px-0 lg:pb-0"
    >
      {/*
        A signpost naming the garden, standing on the control slab. Both are
        cut from the same wood as the fence, so the chrome reads as part of the
        garden rather than as page furniture sitting on top of it.
      */}
      <div className="flex flex-col items-end pr-6">
        <div className="mr-8 flex flex-col items-center">
          {/* The garden's weather, flying above its own sign. */}
          <WindIndicator className="mb-[3px] text-[#3b6fd4]" />
          <div className="relative z-10 rounded-[2px] border-[2px] border-[#6f553a] bg-[#c8a273] px-3 py-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
            <span className="font-pixel text-[11px] tracking-wide text-[#3a2a18]">
              Zen Garden
            </span>
          </div>
          <div className="flex gap-7">
            <span className="h-[9px] w-[3px] bg-[#8a6b4a]" />
            <span className="h-[9px] w-[3px] bg-[#8a6b4a]" />
          </div>
        </div>

        <div
          className="relative flex flex-col items-end gap-[6px] rounded-[3px] border-[3px] border-[#6f553a] bg-[#b08a5e] px-3 py-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_0_#6f553a]"
          style={{
            // Plank seams, hard-edged so they stay in keeping with the pixels.
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 15px, rgba(111,85,58,0.38) 15px 16px)",
          }}
        >
          <BuilderRow label="flowers">
            <FlowerPicker
              value={flower}
              colour={colour}
              active={kind === "flower"}
              onChange={(id) => {
                setFlower(id);
                setKind("flower");
              }}
            />
          </BuilderRow>

          <BuilderRow label="colour">
            <ColourPicker value={colour} onChange={setColour} />
          </BuilderRow>

          <BuilderRow label="pots">
            <PotPicker value={pot} onChange={setPot} />
          </BuilderRow>

          <BuilderRow label="bushes">
            <BushPicker
              value={bush}
              active={kind === "bush"}
              onChange={(v) => {
                setBush(v);
                setKind("bush");
              }}
            />
          </BuilderRow>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setResetToken((t) => t + 1);
                setLastPlanted(null);
              }}
              className="rounded-[2px] border border-[#6f553a] bg-[#efdcc0] px-2 py-[3px] font-pixel text-[9px] font-bold text-[#2f2112] transition-colors hover:bg-white"
            >
              clear garden
            </button>
            <LastPlanted at={lastPlanted} />
          </div>
          {/* Two legs driving the slab into the ground below. */}
          <span
            aria-hidden
            className="absolute top-full left-1/2 flex -translate-x-1/2 gap-16"
          >
            <span className="h-[26px] w-[7px] border-x-2 border-[#6f553a] bg-[#a3835c]" />
            <span className="h-[26px] w-[7px] border-x-2 border-[#6f553a] bg-[#a3835c]" />
          </span>
        </div>
      </div>

      <GardenCanvas
        brush={brush}
        plane="wedge"
        onPlant={setLastPlanted}
        resetToken={resetToken}
      />
    </div>
  );
}
