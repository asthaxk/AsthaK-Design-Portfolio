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
      <div className="mx-auto flex h-[96px] w-full max-w-rail flex-wrap items-center justify-between gap-y-4 px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-[12px]">
          <span className="flex items-center justify-center rounded-[8px] border border-ink bg-ink p-[8px] shadow-(--shadow-xs-token)">
            {/* 20px icon box; the bloom leaf overflows to inset -22.73% per Figma */}
            <span className="relative block size-[20px]">
              <Image
                src="/logo.svg"
                alt=""
                width={29}
                height={29}
                className="absolute left-[-4.55px] top-[-4.55px] h-[29.09px] w-[29.09px] max-w-none"
              />
            </span>
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
