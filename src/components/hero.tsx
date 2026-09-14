import Image from "next/image";
import Link from "next/link";
import { PixelEmoji } from "./pixel-emoji";

export function Hero() {
  // Held at a multiple of 48 so a vertically centred block lands on the
  // centred dot rows: half of a 48 multiple is itself a whole dot, so the
  // phase holds at any viewport height. Pinning the height rather than padding
  // to it means small content changes cannot knock the rhythm off the grid.
  return (
    <div className="pointer-events-auto relative min-h-[528px] max-w-[560px] [@media(max-height:800px)]:min-h-[432px]">
        {/*
          Outer box is 118px at the design height and shrinks with the viewport.
          The leaf keeps Figma's crop as percentages of that box — 244/118 and
          223/118 wide/tall, offset -63/118 and -51/118 — so the geometry ratio
          survives at every size.
        */}
        <div className="relative size-24 overflow-hidden rounded-full [@media(max-height:680px)]:size-[72px]">
          <Image
            src="/astha.jpg"
            alt="Astha Khurana"
            width={244}
            height={223}
            priority
            className="absolute left-[-58%] top-[-43.22%] h-[188.98%] w-[206.78%] max-w-none object-cover"
          />
        </div>

        <h1 className="mt-6 text-[24px] leading-[24px] font-bold text-ink [@media(max-height:800px)]:mt-3">
          Hi! I&rsquo;m Astha :)
        </h1>
        <p className="mt-6 max-w-[600px] text-[18px] leading-[24px] text-ink [@media(max-height:800px)]:mt-3">
          Design leader, 0-1 specialist and chai-lover <PixelEmoji name="chai" size={19} />. Building AI tools used
          in thousands of Indian courtrooms at Adalat AI.
        </p>

        <ul className="mt-6 max-w-[768px] space-y-3 text-[18px] leading-[24px] text-ink [@media(max-height:800px)]:mt-3">
          <li>
            <PixelEmoji name="laptop" size={17} /> Hiring for my team at{" "}
            <Link
              href="https://adalat.ai/careers"
              className="no-underline hover:underline hover:decoration-wavy hover:decoration-[2.5px] hover:underline-offset-[2px] hover:decoration-[#101828]"
            >
              Adalat AI
            </Link>
          </li>
          <li>
            <PixelEmoji name="clover" size={18} /> Mentoring junior designers at{" "}
            <Link href="#adplist" className="no-underline hover:underline hover:decoration-wavy hover:decoration-[2.5px] hover:underline-offset-[2px] hover:decoration-[#101828]">
              adplist
            </Link>
          </li>
          <li>
            <PixelEmoji name="pen" size={18} /> Advocating for design in product
            teams on{" "}
            <Link href="#linkedin" className="no-underline hover:underline hover:decoration-wavy hover:decoration-[2.5px] hover:underline-offset-[2px] hover:decoration-[#101828]">
              Linkedin
            </Link>{" "}
            and Substack (coming soon)
          </li>
        </ul>

        <p className="mt-6 max-w-[648px] text-[18px] leading-[24px] text-ink [@media(max-height:800px)]:mt-3">
          Building for unexplored audiences? Or just want to chat about design?
        </p>

        <Link
          id="book-a-call"
          href="#book-a-call"
          className="mt-6 inline-flex items-center justify-center rounded-[3px] border-2 border-accent bg-white px-6 py-3 font-pixel text-[12px] leading-[1] font-bold text-accent shadow-[4px_4px_0_0_var(--color-accent-shadow)] transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-accent-shadow)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none [@media(max-height:800px)]:mt-3"
        >
          Book a Call
        </Link>
    </div>
  );
}
