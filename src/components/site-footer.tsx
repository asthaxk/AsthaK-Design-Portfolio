export function SiteFooter() {
  return (
    <footer className="border-t border-ink/100">
      <div className="mx-auto flex min-h-[clamp(56px,9.8vh,96px)] w-full max-w-rail flex-wrap items-center justify-between gap-y-3 px-4 py-4 sm:px-[30px] sm:py-0">
        <p className="flex gap-[4px] text-[16px] leading-[20px] text-ink">
          <span aria-hidden>💡</span>
          <span>Create before you consume</span>
        </p>
        <p className="text-[16px] leading-[20px] text-ink sm:text-right">
          Designed and developed by Astha Khurana ©️ 2023
        </p>
      </div>
    </footer>
  );
}
