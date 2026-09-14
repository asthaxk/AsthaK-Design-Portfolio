import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex-1 overflow-hidden">
      {/* Figma: #f9efdd rect, 100px blur — soft cream field that falls off at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-glow blur-[100px]"
      />

      <div className="relative mx-auto w-full max-w-rail px-4 pt-[98px] pb-[114px] sm:px-8">
        {/* Outer box 118×118; inner leaf 244×223 offset -63/-51 (object-cover crop from Figma) */}
        <div className="relative size-[118px] overflow-hidden rounded-full">
          <Image
            src="/astha.jpg"
            alt="Astha Khurana"
            width={244}
            height={223}
            priority
            className="absolute left-[-63px] top-[-51px] h-[223px] w-[244px] max-w-none object-cover"
          />
        </div>

        <h1 className="mt-[40px] text-[24px] leading-[24px] font-bold text-ink">
          Hi! I&rsquo;m Astha <span aria-hidden>👋</span>
        </h1>
        <p className="mt-[14px] max-w-[613px] text-[20px] leading-[28px] text-ink">
          A seasoned Product Designer, UX Specialist and chai-lover ☕️ Spending
          my days freelancing, discovering good food all over India and building
          a yoga practice
        </p>

        <ul className="mt-[48px] max-w-[787px] space-y-[14px] text-[20px] leading-[28px] text-ink">
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

        <p className="mt-[44px] max-w-[652px] text-[20px] leading-[28px] text-ink">
          Open to new projects! Want to work together or just chat about design?
        </p>

        <Link
          id="book-a-call"
          href="#book-a-call"
          className="mt-[20px] inline-flex items-center justify-center rounded-[8px] border border-cream bg-cream px-[18px] py-[10px] font-ui text-[16px] leading-[24px] font-semibold text-ink shadow-(--shadow-2xl-token)"
        >
          Book a Call
        </Link>
      </div>
    </section>
  );
}
