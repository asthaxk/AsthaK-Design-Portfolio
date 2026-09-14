import { Garden } from "@/components/garden/garden";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Garden — Astha Khurana" };

export default function GardenPage() {
  return (
    <>
      <SiteHeader />
      <section className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-glow blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto w-full max-w-rail px-4 py-8 sm:px-8">
          <Garden />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
