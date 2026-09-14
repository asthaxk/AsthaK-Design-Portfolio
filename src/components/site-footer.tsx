import { PixelEmoji } from "./pixel-emoji";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/100">
      <div className="mx-auto flex min-h-[72px] w-full max-w-rail flex-wrap items-center justify-between gap-y-3 px-4 py-3 sm:px-6 sm:py-0">
        <p className="flex gap-[4px] text-[16px] leading-[20px] text-ink">
          <PixelEmoji name="rose" size={16} />
          <span>tiny wins</span>
        </p>
        <p className="text-[16px] leading-[20px] text-ink sm:text-right">
          Designed and developed by Astha Khurana ©️ 2026
        </p>
      </div>
    </footer>
  );
}
