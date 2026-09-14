"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { COLOURS, type FlowerId } from "./sprites";
import { ColourPicker, FlowerPicker } from "./pickers";

const GardenCanvas = dynamic(
  () => import("./garden-canvas").then((m) => m.GardenCanvas),
  { ssr: false, loading: () => null },
);

/**
 * The garden as it sits on the home page: the plane bleeds into the bottom
 * right corner of the fold, and the controls tuck into the empty triangle the
 * wedge leaves above it. Both are positioned against the section rather than
 * the content rail, so the ground can run to the page edge.
 */
export function GardenScene() {
  const [flower, setFlower] = useState<FlowerId>("daisy");
  const [colour, setColour] = useState(COLOURS[0]);

  return (
    <>
      <div
        id="garden"
        className="absolute right-0 bottom-0 w-[min(58%,660px)] max-md:hidden"
      >
        <GardenCanvas flower={flower} colour={colour} plane="wedge" />
      </div>

      <div className="absolute top-[clamp(12px,4vh,44px)] right-4 z-10 flex flex-col items-end gap-3 max-md:hidden sm:right-8">
        <FlowerPicker value={flower} colour={colour} onChange={setFlower} />
        <ColourPicker value={colour} onChange={setColour} />
        <p className="font-pixel text-[10px] text-ink/60">
          Double click the garden to plant
        </p>
      </div>
    </>
  );
}
