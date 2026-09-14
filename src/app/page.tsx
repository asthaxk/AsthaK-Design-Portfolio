import { Hero } from "@/components/hero";
import { GardenScene } from "@/components/garden/garden-scene";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <section className="relative flex flex-1 items-start overflow-hidden">
        {/* Figma: #f9efdd rect, 100px blur — soft cream field that falls off at the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-glow blur-[100px]"
        />

        {/* Dot grid over the cream field, under the content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)",
            backgroundSize: "var(--spacing-dot) var(--spacing-dot)",
            // Centred horizontally so the columns line up with the centred
            // rail; the section's own top edge anchors the rows.
            backgroundPosition: "center top",
          }}
        />

        {/*
          The garden bleeds into the bottom right of the fold and its controls
          tuck into the empty triangle the wedge leaves above; the hero copy
          sits in the space the diagonal opens up on the left.
        */}
        <GardenScene />

        {/* The rail is full width but mostly empty, so it must not swallow
            clicks meant for the garden behind it; the hero column re-enables them. */}
        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-rail px-4 py-6 sm:px-6 [@media(max-height:800px)]:py-3">
          <Hero />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
