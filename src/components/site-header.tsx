import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Play", href: "#garden" },
  { label: "Writing", href: "#writing" },
  { label: "Resume", href: "#resume" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink/100">
      <div className="mx-auto flex h-24 w-full max-w-rail flex-wrap items-center justify-between gap-y-4 px-4 sm:px-6 [@media(max-height:800px)]:h-[72px]">
        <Link href="/" className="flex items-center gap-[12px]">
          {/* Figma "logo white" (5:222) — the mark stands alone; its bloom
              overflows the box to inset -22.73%, as percentages so it scales. */}
          <span className="relative block size-[clamp(32px,4.4vh,40px)] shrink-0">
            <Image
              src="/logo.svg"
              alt=""
              width={264}
              height={264}
              priority
              className="absolute left-[-22.73%] top-[-22.73%] h-[145.46%] w-[145.46%] max-w-none"
            />
          </span>
          <span className="text-[16px] leading-[20px] font-bold text-ink">
            Astha Khurana
          </span>
        </Link>

        <div className="flex items-center gap-[20px] sm:gap-[32px]">
          <nav className="flex items-center gap-[20px]">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[16px] leading-[20px] whitespace-nowrap text-ink hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#book-a-call"
            className="inline-flex items-center justify-center rounded-[3px] bg-accent px-6 py-3 font-pixel text-[12px] leading-[1] font-bold text-white shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none whitespace-nowrap"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  );
}
