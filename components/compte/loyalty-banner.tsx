"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type LoyaltyBannerProps = {
  points: number;
  goldThreshold: number;
  platinumThreshold: number;
  advantages: string[];
};

const goldGradient = "linear-gradient(180deg, #f7e3ac 0%, #e8c468 55%, #a9781f 100%)";
const goldTextStyle = { background: goldGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

/**
 * Gold → Platine only for now — the loyalty program's first two paliers. Points accrual isn't
 * wired to anything real yet (see the placeholder values passed from ComptePageContent): this is
 * the UI for the tier-progress banner, ahead of the actual earning/threshold logic.
 * The card ground deliberately reuses the site's --brand-taupe-muted (#886666) as a full fill
 * instead of its usual thin accent role, so it reads as its own object against the white/cream
 * cards elsewhere on the account page — no foreign hue introduced.
 */
export function LoyaltyBanner({ points, goldThreshold, platinumThreshold, advantages }: LoyaltyBannerProps) {
  const [open, setOpen] = useState(false);
  const progress = Math.min(100, Math.max(0, ((points - goldThreshold) / (platinumThreshold - goldThreshold)) * 100));
  const remaining = Math.max(0, platinumThreshold - points);

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 shadow-[0_24px_48px_-20px_rgba(42,28,27,0.55),0_8px_20px_-10px_rgba(42,28,27,0.42)] sm:p-7"
      style={{
        background:
          "radial-gradient(120% 140% at 8% -10%, rgba(232,196,104,0.2), transparent 55%), linear-gradient(250deg, var(--brand-taupe-muted) 3.3%, #4b2e2c 45%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.05) 45%, transparent 60%)" }}
      />

      <div className="relative flex flex-wrap items-baseline gap-2.5">
        <span
          className="font-[family-name:var(--font-prata)] text-[44px] leading-none tabular-nums sm:text-[52px]"
          style={goldTextStyle}
        >
          {points.toLocaleString("fr-FR")}
        </span>
        <span className="pb-1.5 text-[16px] font-bold text-[rgba(251,243,238,0.7)]">points fidélité</span>
      </div>
      <p className="relative mt-1.5 text-[14.5px] text-[rgba(251,243,238,0.7)]">
        {remaining.toLocaleString("fr-FR")} points avant le palier Platine
      </p>

      <div className="relative mt-6">
        <div className="relative h-[34px] overflow-hidden rounded-full border border-[rgba(251,243,238,0.1)] bg-[rgba(251,243,238,0.16)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #e8c468 0%, #f7e3ac 45%, #f7f8fb 78%, #cdd3dc 100%)",
              boxShadow: "0 0 18px 2px rgba(232,196,104,0.45)",
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center justify-center px-3.5" style={{ left: `${progress}%` }}>
            <span className="text-[12.5px] font-semibold whitespace-nowrap text-[rgba(251,243,238,0.72)]">
              {remaining.toLocaleString("fr-FR")} pts → Platine
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[11.5px] tabular-nums text-[rgba(251,243,238,0.4)]">
          <span>{goldThreshold.toLocaleString("fr-FR")} pts</span>
          <span>{platinumThreshold.toLocaleString("fr-FR")} pts</span>
        </div>
      </div>

      <div className="relative mt-5 border-t border-[rgba(251,243,238,0.12)] pt-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2.5 rounded-lg py-0.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7e3ac]"
        >
          <span className="text-[14.5px] font-bold text-[#fbf3ee]">
            Voir les avantages <span style={goldTextStyle}>Gold</span>
          </span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            className={cn(
              "size-4 shrink-0 text-[rgba(251,243,238,0.7)] transition-transform duration-300",
              open && "rotate-180",
            )}
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
          <div className="overflow-hidden">
            <ul className="mt-3 flex flex-col gap-2.5">
              {advantages.map((advantage) => (
                <li key={advantage} className="flex items-start gap-2.5 text-[14px] leading-snug text-[rgba(251,243,238,0.7)]">
                  <svg aria-hidden viewBox="0 0 20 20" fill="none" className="mt-0.5 size-[15px] shrink-0">
                    <path d="M4 10.5L8 14.5L16 5.5" stroke="#f7e3ac" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
