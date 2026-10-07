import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PrestationChoiceQuestion } from "@/lib/data/booking-services";

type PrestationChoiceProps = {
  questions: PrestationChoiceQuestion[];
  /** Picked option id per question id. */
  value: (questionId: string) => string | undefined;
  onChoose: (questionId: string, optionId: string) => void;
  showErrors: boolean;
};

/** Shown right under a selected prestation that asks the client to pick a style (which braids,
 *  which curls…): one photo tile per answer, a smaller cousin of the Bar Beauty cards. A choice is
 *  mandatory — `missingChoices` (lib/booking/questions) keeps "Continuer" from moving on without it. */
export function PrestationChoice({ questions, value, onChoose, showErrors }: PrestationChoiceProps) {
  return (
    <div className="prestation-choice-reveal mt-4 flex flex-col gap-5">
      {questions.map((question) => {
        const picked = value(question.id);
        const isMissing = showErrors && !picked;
        return (
          <div
            key={question.id}
            data-missing={isMissing || undefined}
            className={cn(
              "scroll-mt-28 rounded-xl border p-3 transition-colors sm:p-4",
              isMissing
                ? "border-[var(--color-error)] bg-[rgba(237,220,218,0.25)]"
                : "border-[rgba(128,101,98,0.2)] bg-[rgba(237,220,218,0.25)]",
            )}
          >
            <p id={`choice-${question.id}`} className="text-[17px] font-bold text-[var(--color-gray-800)]">
              {question.label} <span className="text-[13px] font-normal text-[var(--color-error)]">(obligatoire)</span>
            </p>

            <div
              role="radiogroup"
              aria-labelledby={`choice-${question.id}`}
              className="mt-3 grid max-w-[560px] grid-cols-3 gap-2 sm:gap-3"
            >
              {question.options.map((option) => {
                const selected = picked === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChoose(question.id, option.id)}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition",
                      selected
                        ? "border-[var(--brand-taupe-muted)] shadow-md"
                        : "border-[var(--color-gray-100)] hover:border-[var(--brand-taupe-muted)]/40",
                    )}
                  >
                    {option.image && (
                      <span className="relative block aspect-[4/5] w-full bg-[var(--brand-cream)]">
                        <Image
                          src={option.image}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 180px, 30vw"
                          className={cn("object-cover transition", !selected && "group-hover:scale-[1.02]")}
                        />
                        {selected && (
                          <span className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-full bg-[var(--brand-taupe-muted)] shadow-md ring-2 ring-white">
                            <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none">
                              <path
                                d="M5 12.5l4.5 4.5L19 7.5"
                                stroke="white"
                                strokeWidth={3.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        )}
                      </span>
                    )}
                    <span
                      className={cn(
                        "flex flex-1 items-center gap-2 px-2 py-2 text-[14px] leading-tight font-bold break-words hyphens-auto sm:px-3 sm:py-2.5 sm:text-[15px]",
                        selected ? "text-[var(--brand-taupe-muted)]" : "text-[var(--color-gray-800)]",
                      )}
                    >
                      {!option.image && (
                        <span
                          className={cn(
                            "size-4 shrink-0 rounded-full border-2",
                            selected
                              ? "border-[var(--brand-taupe-muted)] bg-[var(--brand-taupe-muted)]"
                              : "border-[var(--color-slate-900)]",
                          )}
                        />
                      )}
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {isMissing && <p className="mt-3 text-[13px] text-[var(--color-error)]">Veuillez choisir une option</p>}
          </div>
        );
      })}
    </div>
  );
}
