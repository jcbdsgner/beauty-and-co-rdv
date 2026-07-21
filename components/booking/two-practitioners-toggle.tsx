"use client";

import { cn } from "@/lib/utils";
import { formatDurationMinutes } from "@/lib/booking/format";

type TwoPractitionersToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  totalMinutes: number;
};

export function TwoPractitionersToggle({ enabled, onChange, totalMinutes }: TwoPractitionersToggleProps) {
  const halvedMinutes = Math.round(totalMinutes / 2);

  return (
    <div className="mt-4 rounded-2xl bg-[rgba(253,207,202,0.35)] p-[18px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[17px] text-[#1d2939]">
            Je veux <span className="font-bold text-[#886666]">gagner 2x plus de temps</span> avec 2
            praticiens, gratuitement.
            {totalMinutes > 0 && (
              <>
                {" "}
                Votre rendez-vous passe de {formatDurationMinutes(totalMinutes)} à{" "}
                <span className="font-bold">{formatDurationMinutes(halvedMinutes)}</span>.
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
            enabled ? "bg-[#886666]" : "bg-[#d0d5dd]",
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
