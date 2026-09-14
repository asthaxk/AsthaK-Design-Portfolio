import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden">
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
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto w-full max-w-rail px-4 py-[clamp(24px,5vh,56px)] sm:px-8">
        {/*
          Outer box is 118px at the design height and shrinks with the viewport.
          The leaf keeps Figma's crop as percentages of that box — 244/118 and
          223/118 wide/tall, offset -63/118 and -51/118 — so the geometry ratio
          survives at every size.
        */}
        <div className="relative size-[clamp(76px,12vh,118px)] translate-x-[10px] rotate-[-8deg] overflow-hidden rounded-full border-[clamp(7px,1.3vh,11px)] border-white shadow-[0_1px_2px_rgba(16,24,40,0.22),0_3px_6px_-1px_rgba(16,24,40,0.20),0_14px_26px_-10px_rgba(16,24,40,0.32)]">
          <Image
            src="/astha.jpg"
            alt="Astha Khurana"
            width={244}
            height={223}
            priority
            className="absolute left-[-58%] top-[-43.22%] h-[188.98%] w-[206.78%] max-w-none object-cover"
          />
        </div>

        <h1 className="mt-[clamp(16px,4vh,40px)] text-[clamp(20px,2.4vh,24px)] leading-[1] font-bold text-ink">
          Hi! I&rsquo;m Astha <span aria-hidden>👋</span>
        </h1>
        <p className="mt-[clamp(8px,1.4vh,14px)] max-w-[613px] text-[clamp(16px,2vh,20px)] leading-[1.4] text-ink">
          A seasoned Product Designer, UX Specialist and chai-lover ☕️ Spending
          my days freelancing, discovering good food all over India and building
          a yoga practice
        </p>

        <ul className="mt-[clamp(18px,4.9vh,48px)] max-w-[787px] space-y-[clamp(6px,1.4vh,14px)] text-[clamp(16px,2vh,20px)] leading-[1.4] text-ink">
          <li>
            <span aria-hidden>👩🏼‍💻</span>{" "}
            <Link href="#no-code" className="underline decoration-solid">
              Building no-code websites
            </Link>
          </li>
          <li>
            <span aria-hidden>🎨</span> Designing products at SaaS startups
          </li>
          <li>
            <span aria-hidden>✍🏼</span> Advocating for design in product teams:{" "}
            <Link href="#twitter" className="underline decoration-solid">
              Twitter
            </Link>{" "}
            and{" "}
            <Link href="#newsletter" className="underline decoration-solid">
              Newsletter
            </Link>
          </li>
        </ul>

        <p className="mt-[clamp(16px,4.5vh,44px)] max-w-[652px] text-[clamp(16px,2vh,20px)] leading-[1.4] text-ink">
          Open to new projects! Want to work together or just chat about design?
        </p>

        <Link
          id="book-a-call"
          href="#book-a-call"
          className="mt-[clamp(10px,2vh,20px)] inline-flex items-center justify-center rounded-[8px] border border-cream bg-cream px-[18px] py-[clamp(7px,1.1vh,10px)] font-ui text-[16px] leading-[24px] font-semibold text-ink shadow-(--shadow-2xl-token)"
        >
          Book a Call
        </Link>
      </div>
    </section>
  );
}
