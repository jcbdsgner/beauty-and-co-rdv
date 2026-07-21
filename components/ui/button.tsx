import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "brand" | "outline" | "gradient" | "lilac";
  className?: string;
  /** Set when href leaves this site (a separate Beauty and Co property, e.g. the shop or gift card site). Opens in a new tab and shows an external-link cue so the user knows they're navigating away. */
  external?: boolean;
};

const variants = {
  brand:
    "bg-[var(--core-brand-color,#fdcfca)] text-[var(--text-secondary,#344054)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:opacity-90",
  outline:
    "bg-white border border-[var(--brand-color-1,rgba(216,184,180,0.5))] text-[var(--button-2-color,#a27576)] hover:bg-black/[.02]",
  gradient:
    "bg-gradient-to-r from-[#fead40] via-[#fe6020] via-[31.5%] to-[#f6017f] to-[89.5%] text-white hover:opacity-90",
  lilac:
    "bg-[#e4c8ff] text-[var(--text-secondary,#344054)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:opacity-90",
};

export function Button({
  href,
  children,
  icon,
  variant = "brand",
  className,
  external = false,
}: ButtonProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[17px] font-medium transition",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
      {external && (
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className="size-4 shrink-0"
        >
          <path
            d="M7 13L13 7M13 7H8M13 7V12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}
