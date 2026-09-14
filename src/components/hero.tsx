import Image from "next/image";
import Link from "next/link";
import { PixelIcon } from "./pixel-icon";

export function Hero() {
  return (
    <div className="pointer-events-auto relative max-w-[560px]">
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
          Design leader, 0-1 specialist and chai-lover <PixelIcon name="coffee" size={17} />. Building AI tools used
          in thousands of Indian courtrooms at Adalat AI.
        </p>

        <ul className="mt-12 max-w-[768px] space-y-6 text-[18px] leading-[24px] text-ink [@media(max-height:800px)]:mt-6 [@media(max-height:800px)]:space-y-3">
          <li>
            <PixelIcon name="laptop" size={17} /> Hiring for my team at{" "}
            <Link
              href="https://adalat.ai/careers"
              className="underline decoration-solid"
            >
              Adalat AI
            </Link>
          </li>
          <li>
            <PixelIcon name="leaf" size={17} /> Mentoring junior designers at{" "}
            <Link href="#adplist" className="underline decoration-solid">
              adplist
            </Link>
          </li>
          <li>
            <PixelIcon name="pencil" size={17} /> Advocating for design in product
            teams on{" "}
            <Link href="#linkedin" className="underline decoration-solid">
              Linkedin
            </Link>{" "}
            and Substack (coming soon)
          </li>
        </ul>

        <p className="mt-12 max-w-[648px] text-[18px] leading-[24px] text-ink [@media(max-height:800px)]:mt-6">
          Building for unexplored audiences? Or just want to chat about design?
        </p>

        <Link
          id="book-a-call"
          href="#book-a-call"
          className="mt-6 inline-flex items-center justify-center rounded-[3px] bg-accent px-6 py-3 font-pixel text-[12px] leading-[1] font-bold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none [@media(max-height:800px)]:mt-3"
        >
          Book a Call
        </Link>
    </div>
  );
}
