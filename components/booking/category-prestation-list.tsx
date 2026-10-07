import { useState, type RefObject } from "react";
import Image from "next/image";
import { cn, toSentenceCase } from "@/lib/utils";
import { CategoryQuestions } from "@/components/booking/category-questions";
import { ExpandChevron } from "@/components/booking/expand-chevron";
import { PrestationChoice } from "@/components/booking/prestation-choice";
import { choiceAnswerId, missingChoices } from "@/lib/booking/questions";
import { formatPrice } from "@/lib/booking/format";
import type { BookingService, BookingSubService } from "@/lib/data/booking-services";

type CategoryPrestationListProps = {
  category: BookingService;
  selectedSubServiceIds: Set<string>;
  onToggleSubService: (subServiceId: string) => void;
  questionAnswers: Record<string, string>;
  onAnswerQuestion: (questionId: string, value: string) => void;
  showQuestionErrors: boolean;
  /** Lets the parent scroll straight to the required-questions block instead of the whole list. */
  questionsRef?: RefObject<HTMLDivElement | null>;
  /** Subservice ids already paid for by the active person's owned Pack or active Abonnement, and which of the two — rendered as "Déjà payé" instead of their price. */
  coverageBySubServiceId?: Map<string, "pack" | "abonnement">;
};

function groupBySubcategory(subServices: BookingSubService[]) {
  const groups: { name: string; subs: BookingSubService[] }[] = [];
  for (const sub of subServices) {
    if (!sub.subcategory) continue;
    const group = groups.find((candidate) => candidate.name === sub.subcategory);
    if (group) group.subs.push(sub);
    else groups.push({ name: sub.subcategory, subs: [sub] });
  }
  return groups;
}

type ChoiceProps = {
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  showErrors: boolean;
};

function FlatSubServiceRow({
  sub,
  selected,
  onToggle,
  coverageSource,
  choice,
}: {
  sub: BookingSubService;
  selected: boolean;
  onToggle: () => void;
  coverageSource?: "pack" | "abonnement";
  choice: ChoiceProps;
}) {
  return (
    <li className="border-b border-[var(--color-gray-200)] py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[19px] font-bold text-[var(--color-gray-800)]">{toSentenceCase(sub.label)}</p>
          {sub.description && <p className="mt-1 text-[15px] text-[var(--color-gray-500)]">{sub.description}</p>}
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gray-200)] px-[13px] py-[7px] text-[15px] font-[500] text-[var(--color-gray-800)]">
              <Image src="/images/rdv/icon-clock-dark.svg" alt="" width={16} height={16} />
              {sub.duration}
            </span>
            {coverageSource ? (
              <span className="text-[15px] font-bold text-[var(--brand-taupe-muted)]">
                · Déjà payé avec votre {coverageSource === "pack" ? "pack" : "abonnement"}
              </span>
            ) : (
              <span className="text-[17px] font-[500] text-[var(--color-gray-800)]">· {formatPrice(sub.price)}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          aria-label={selected ? `${sub.label} — sélectionné` : `${sub.label} — sélectionner`}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded border transition sm:hidden",
            selected ? "border-[var(--brand-taupe-muted)] bg-[var(--brand-taupe-muted)]" : "border-[var(--color-slate-900)] bg-white",
          )}
        >
          {selected && <Image src="/images/rdv/icon-check.svg" alt="" width={14} height={14} />}
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          className={cn(
            "hidden shrink-0 rounded-full border border-[var(--brand-taupe-muted)] px-[13px] py-[7px] text-[15px] font-[450] whitespace-nowrap transition sm:block",
            selected ? "bg-[var(--brand-taupe-muted)] text-white" : "bg-white text-[var(--brand-taupe-muted)] hover:bg-[var(--brand-taupe-muted)]/5",
          )}
        >
          {selected ? "Sélectionné" : "Sélectionner"}
        </button>
      </div>
      {selected && sub.choiceQuestions && sub.choiceQuestions.length > 0 && (
        <PrestationChoice
          questions={sub.choiceQuestions}
          value={(questionId) => choice.answers[choiceAnswerId(sub.id, questionId)]}
          onChoose={(questionId, optionId) => choice.onAnswer(choiceAnswerId(sub.id, questionId), optionId)}
          showErrors={choice.showErrors}
        />
      )}
    </li>
  );
}

export function CategoryPrestationList({
  category,
  selectedSubServiceIds,
  onToggleSubService,
  questionAnswers,
  onAnswerQuestion,
  showQuestionErrors,
  questionsRef,
  coverageBySubServiceId,
}: CategoryPrestationListProps) {
  // Accordion, not independent toggles: opening a subcategory closes whichever one was open —
  // its checkbox only stays checked afterward if a prestation was actually picked from it.
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  const toggleSubcategory = (name: string) => {
    setExpandedSubcategory((prev) => (prev === name ? null : name));
  };

  const groups = groupBySubcategory(category.subServices);
  const choice: ChoiceProps = { answers: questionAnswers, onAnswer: onAnswerQuestion, showErrors: showQuestionErrors };
  // After a "Continuer" warning, a sub-category hiding a prestation whose photo choice is still
  // missing opens by itself — otherwise the warning would point at nothing visible.
  const missingSubIds = showQuestionErrors
    ? new Set(missingChoices(category.id, questionAnswers, selectedSubServiceIds).map(({ sub }) => sub.id))
    : new Set<string>();
  const hasSubcategories = groups.length > 0;

  return (
    <div>
      <div ref={questionsRef}>
        <CategoryQuestions
          questions={category.requiredQuestions ?? []}
          answers={questionAnswers}
          onAnswer={onAnswerQuestion}
          showErrors={showQuestionErrors}
        />
      </div>

      {hasSubcategories ? (
        <div className="flex flex-col gap-4">
          {groups.map((group) => {
            const expanded =
              expandedSubcategory === group.name || group.subs.some((sub) => missingSubIds.has(sub.id));
            const hasSelection = group.subs.some((sub) => selectedSubServiceIds.has(sub.id));
            const checked = expanded || hasSelection;
            return (
              <div
                key={group.name}
                className={cn(
                  "rounded-xl border-2 transition",
                  expanded ? "border-[var(--brand-taupe-muted)] shadow-lg" : "border-[var(--color-border-light)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleSubcategory(group.name)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-4 p-6 text-left"
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded border transition",
                      checked ? "border-[var(--brand-taupe-muted)] bg-[var(--brand-taupe-muted)]" : "border-[var(--color-slate-900)] bg-white",
                    )}
                  >
                    {checked && <Image src="/images/rdv/icon-check.svg" alt="" width={12} height={12} />}
                  </span>
                  <span className="flex-1 text-[20px] font-bold text-[var(--color-gray-800)]">{group.name}</span>
                  <ExpandChevron open={expanded} />
                </button>
                {expanded && (
                  <ul className="flex flex-col border-t border-[var(--color-gray-200)] px-6">
                    {group.subs.map((sub) => (
                      <FlatSubServiceRow
                        key={sub.id}
                        sub={sub}
                        selected={selectedSubServiceIds.has(sub.id)}
                        onToggle={() => onToggleSubService(sub.id)}
                        coverageSource={coverageBySubServiceId?.get(sub.id)}
                        choice={choice}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="flex flex-col">
          {category.subServices.map((sub) => (
            <FlatSubServiceRow
              key={sub.id}
              sub={sub}
              selected={selectedSubServiceIds.has(sub.id)}
              onToggle={() => onToggleSubService(sub.id)}
              coverageSource={coverageBySubServiceId?.get(sub.id)}
              choice={choice}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
