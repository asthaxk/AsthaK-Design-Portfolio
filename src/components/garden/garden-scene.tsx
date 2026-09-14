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
  return (
    <p className="font-pixel text-[9px] text-ink/60">
      double click to plant
      {at === null ? "" : ` · last ${sinceLabel(at, now)}`}
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
      className="absolute right-0 bottom-0 z-10 w-[min(58%,660px)] max-md:hidden"
    >
      <div className="flex flex-col items-end gap-[6px] px-4 pb-2">
        <p className="font-pixel text-[11px] tracking-wide text-ink">
          Zen Garden
        </p>

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
            className="rounded-[6px] border border-ink/15 bg-white/60 px-2 py-[3px] font-pixel text-[8px] text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
          >
            clear garden
          </button>
          <LastPlanted at={lastPlanted} />
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
