import { cn, toSentenceCase } from "@/lib/utils";
import { CategoryQuestions } from "@/components/booking/category-questions";
import { formatPrice } from "@/lib/booking/format";
import type { BookingService } from "@/lib/data/booking-services";

type CategoryPrestationListProps = {
  category: BookingService;
  selectedSubServiceIds: Set<string>;
  onToggleSubService: (subServiceId: string) => void;
  questionAnswers: Record<string, string>;
  onAnswerQuestion: (questionId: string, value: string) => void;
  showQuestionErrors: boolean;
};

export function CategoryPrestationList({
  category,
  selectedSubServiceIds,
  onToggleSubService,
  questionAnswers,
  onAnswerQuestion,
  showQuestionErrors,
}: CategoryPrestationListProps) {
  return (
    <div>
      <CategoryQuestions
        questions={category.requiredQuestions ?? []}
        answers={questionAnswers}
        onAnswer={onAnswerQuestion}
        showErrors={showQuestionErrors}
      />

      <ul className="flex flex-col">
        {category.subServices.map((sub) => {
          const selected = selectedSubServiceIds.has(sub.id);
          return (
            <li key={sub.id} className="flex items-center gap-3 border-b border-[#eaecf0] py-4 last:border-b-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[19px] font-bold text-[#1d2939]">{toSentenceCase(sub.label)}</p>
                <p className="text-[17px] font-[500] text-[#667085]">
                  {sub.duration} · {formatPrice(sub.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleSubService(sub.id)}
                aria-pressed={selected}
                className={cn(
                  "shrink-0 rounded-full border border-[#806562] px-[13px] py-[7px] text-[15px] font-[450] whitespace-nowrap transition",
                  selected
                    ? "bg-[#806562] text-white"
                    : "bg-white text-[#806562] hover:bg-[#806562]/5",
                )}
              >
                {selected ? "Sélectionné" : "Sélectionner"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
