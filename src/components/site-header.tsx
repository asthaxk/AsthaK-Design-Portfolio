import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "About", href: "#about" },
  { label: "No-Code", href: "#no-code" },
  { label: "Product + UX", href: "#product-ux" },
  { label: "Writing", href: "#writing" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink/100">
      <div className="mx-auto flex h-[clamp(64px,9.8vh,96px)] w-full max-w-rail flex-wrap items-center justify-between gap-y-4 px-4 sm:px-8">
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
            className="rounded-[8px] border border-cream bg-cream px-[14px] py-[8px] text-[16px] leading-[20px] font-bold whitespace-nowrap text-ink shadow-(--shadow-xs-token)"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  );
}
