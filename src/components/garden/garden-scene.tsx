"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { COLOURS, type FlowerId } from "./sprites";
import { ColourPicker, FlowerPicker, PotToggle } from "./pickers";

const GardenCanvas = dynamic(
  () => import("./garden-canvas").then((m) => m.GardenCanvas),
  { ssr: false, loading: () => null },
);

/** "just now", then seconds, then minutes — enough for a page visit. */
function sinceLabel(at: number, now: number): string {
  const secs = Math.max(0, Math.round((now - at) / 1000));
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  return `${mins}m ago`;
}

function LastPlanted({ at }: { at: number | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (at === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [at]);

  return (
    <p className="font-pixel text-[9px] text-ink/60">
      {at === null
        ? "double click the garden to plant"
        : `last planted ${sinceLabel(at, now)}`}
    </p>
  );
}

/**
 * The garden as it sits on the home page: the plane bleeds into the bottom
 * right corner of the fold, with its controls stacked directly above it so
 * they read as belonging to the garden rather than to the page.
 */
export function GardenScene() {
  const [flower, setFlower] = useState<FlowerId>("daisy");
  const [colour, setColour] = useState(COLOURS[0]);
  const [potted, setPotted] = useState(false);
  const [lastPlanted, setLastPlanted] = useState<number | null>(null);

  return (
    <div
      id="garden"
      className="absolute right-0 bottom-0 z-10 w-[min(58%,660px)] max-md:hidden"
    >
      <div className="flex flex-col items-end gap-2 px-4 pb-3">
        <div className="flex items-end gap-2">
          <FlowerPicker value={flower} colour={colour} onChange={setFlower} />
          <PotToggle value={potted} onChange={setPotted} />
        </div>
        <ColourPicker value={colour} onChange={setColour} />
        <LastPlanted at={lastPlanted} />
      </div>

      <GardenCanvas
        flower={flower}
        colour={colour}
        potted={potted}
        plane="wedge"
        onPlant={setLastPlanted}
      />
    </div>
  );
}
