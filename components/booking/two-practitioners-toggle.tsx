"use client";

import { cn } from "@/lib/utils";
import { formatDurationMinutes } from "@/lib/booking/format";
import { Switch } from "@/components/ui/switch";

type TwoPractitionersToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  soloMinutes: number;
  twoPractitionersMinutes: number;
};

export function TwoPractitionersToggle({
  enabled,
  onChange,
  soloMinutes,
  twoPractitionersMinutes,
}: TwoPractitionersToggleProps) {
  return (
    <div className={cn("mt-4 rounded-2xl bg-[rgba(253,207,202,0.35)] p-[18px]", !enabled && "attention-shake-once")}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[17px] text-[var(--color-gray-800)]">
            <span className="font-bold text-[var(--brand-taupe-muted)]">Gagner 2 fois plus de temps</span> avec 2 praticiens,
            gratuitement.
            {soloMinutes > 0 && (
              <>
                {" "}
                Votre rendez-vous passera de {formatDurationMinutes(soloMinutes)} à{" "}
                <span className="font-bold">{formatDurationMinutes(twoPractitionersMinutes)}</span>.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Activer 2 praticiens"
          onClick={() => onChange(!enabled)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition",
            enabled ? "bg-[var(--brand-taupe-muted)]" : "bg-[var(--color-gray-300)]",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition",
              enabled && "translate-x-5",
            )}
          />
        </button>
      </div>
    </div>
  );
}
