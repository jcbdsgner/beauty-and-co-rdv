import { useState, type RefObject } from "react";
import Image from "next/image";
import { cn, toSentenceCase } from "@/lib/utils";
import { CategoryQuestions } from "@/components/booking/category-questions";
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

function FlatSubServiceRow({
  sub,
  selected,
  onToggle,
}: {
  sub: BookingSubService;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-[#eaecf0] py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[19px] font-bold text-[#1d2939]">{toSentenceCase(sub.label)}</p>
        {sub.description && <p className="mt-1 text-[15px] text-[#667085]">{sub.description}</p>}
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaecf0] px-[13px] py-[7px] text-[15px] font-[500] text-[#1d2939]">
            <Image src="/images/rdv/icon-clock-dark.svg" alt="" width={16} height={16} />
            {sub.duration}
          </span>
          <span className="text-[17px] font-[500] text-[#1d2939]">· {formatPrice(sub.price)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className={cn(
          "shrink-0 rounded-full border border-[#806562] px-[13px] py-[7px] text-[15px] font-[450] whitespace-nowrap transition",
          selected ? "bg-[#806562] text-white" : "bg-white text-[#806562] hover:bg-[#806562]/5",
        )}
      >
        {selected ? "Sélectionné" : "Sélectionner"}
      </button>
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
}: CategoryPrestationListProps) {
  // Accordion, not independent toggles: opening a subcategory closes whichever one was open —
  // its checkbox only stays checked afterward if a prestation was actually picked from it.
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  const toggleSubcategory = (name: string) => {
    setExpandedSubcategory((prev) => (prev === name ? null : name));
  };

  const groups = groupBySubcategory(category.subServices);
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
            const expanded = expandedSubcategory === group.name;
            const hasSelection = group.subs.some((sub) => selectedSubServiceIds.has(sub.id));
            const checked = expanded || hasSelection;
            return (
              <div
                key={group.name}
                className={cn(
                  "rounded-xl border-2 transition",
                  expanded ? "border-[#806562] shadow-lg" : "border-[#e5e7eb]",
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
                      checked ? "border-[#806562] bg-[#806562]" : "border-[#0f172a] bg-white",
                    )}
                  >
                    {checked && <Image src="/images/rdv/icon-check.svg" alt="" width={12} height={12} />}
                  </span>
                  <span className="flex-1 text-[20px] font-bold text-[#1d2939]">{group.name}</span>
                  <span className="flex size-8 shrink-0 items-center justify-center">
                    <Image
                      src="/images/rdv/icon-chevron-down.svg"
                      alt=""
                      width={16}
                      height={16}
                      className={cn("transition-transform", expanded && "rotate-180")}
                    />
                  </span>
                </button>
                {expanded && (
                  <ul className="flex flex-col border-t border-[#eaecf0] px-6">
                    {group.subs.map((sub) => (
                      <FlatSubServiceRow
                        key={sub.id}
                        sub={sub}
                        selected={selectedSubServiceIds.has(sub.id)}
                        onToggle={() => onToggleSubService(sub.id)}
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
            />
          ))}
        </ul>
      )}
    </div>
  );
}
