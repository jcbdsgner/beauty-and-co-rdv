import { cn } from "@/lib/utils";

/** Expand/collapse affordance of the booking's foldable cards (Packs, service sub-categories):
 *  a taupe chevron on a tinted round pad, flipped and darker when open. */
export function ExpandChevron({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--brand-taupe-muted)] transition-colors",
        open ? "bg-[var(--brand-taupe-muted)]/20" : "bg-[var(--brand-taupe-muted)]/10",
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn("transition-transform", open && "rotate-180")}
      >
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
