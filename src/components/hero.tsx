import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="pointer-events-auto relative max-w-[560px]">
        {/*
          Outer box is 118px at the design height and shrinks with the viewport.
          The leaf keeps Figma's crop as percentages of that box — 244/118 and
          223/118 wide/tall, offset -63/118 and -51/118 — so the geometry ratio
          survives at every size.
        */}
        <div className="relative size-[clamp(76px,12vh,118px)] overflow-hidden rounded-full">
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
          Hi! I&rsquo;m Astha :)
        </h1>
        <p className="mt-[clamp(8px,1.4vh,14px)] max-w-[613px] text-[clamp(16px,2vh,20px)] leading-[1.4] text-ink">
          Design leader, 0-1 specialist and chai-lover ☕. Building AI tools used
          in thousands of Indian courtrooms at Adalat AI.
        </p>

        <ul className="mt-[clamp(18px,4.9vh,48px)] max-w-[787px] space-y-[clamp(6px,1.4vh,14px)] text-[clamp(16px,2vh,20px)] leading-[1.4] text-ink">
          <li>
            <span aria-hidden>💻</span> Hiring for my team at{" "}
            <Link
              href="https://adalat.ai/careers"
              className="underline decoration-solid"
            >
              Adalat AI
            </Link>
          </li>
          <li>
            <span aria-hidden>🍀</span> Mentoring junior designers at{" "}
            <Link href="#adplist" className="underline decoration-solid">
              adplist
            </Link>
          </li>
          <li>
            <span aria-hidden>🖊️</span> Advocating for design in product
            teams on{" "}
            <Link href="#linkedin" className="underline decoration-solid">
              Linkedin
            </Link>{" "}
            and Substack (coming soon)
          </li>
        </ul>

        <p className="mt-[clamp(16px,4.5vh,44px)] max-w-[652px] text-[clamp(16px,2vh,20px)] leading-[1.4] text-ink">
          Building for unexplored audiences? Or just want to chat about design?
        </p>

        <Link
          id="book-a-call"
          href="#book-a-call"
          className="mt-[clamp(10px,2vh,20px)] inline-flex items-center justify-center rounded-[8px] border border-cream bg-cream px-[18px] py-[clamp(7px,1.1vh,10px)] font-ui text-[16px] leading-[24px] font-semibold text-ink shadow-(--shadow-2xl-token)"
        >
          Book a Call
        </Link>
    </div>
  );
}
