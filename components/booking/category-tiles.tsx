import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BookingService } from "@/lib/data/booking-services";

type CategoryTilesProps = {
  services: BookingService[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  categoriesWithSelection: Set<string>;
};

export function CategoryTiles({
  services,
  activeCategoryId,
  onSelectCategory,
  categoriesWithSelection,
}: CategoryTilesProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {services.map((service) => {
        const isActive = service.id === activeCategoryId;
        const hasSelection = categoriesWithSelection.has(service.id);

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelectCategory(service.id)}
            aria-pressed={isActive}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-white px-3.5 py-[18px] text-center transition",
              isActive ? "border-[#886666]" : "border-[#d0d5dd] hover:border-[#886666]/50",
            )}
          >
            {hasSelection && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-[#886666]">
                <Image src="/images/rdv/icon-check.svg" alt="" width={10} height={10} />
              </span>
            )}
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-[rgba(237,220,218,0.4)]">
              <Image
                src={service.image}
                alt=""
                width={service.iconOnly ? 24 : 44}
                height={service.iconOnly ? 24 : 44}
                className={service.iconOnly ? undefined : "size-full object-cover"}
              />
            </span>
            <span className="flex min-h-10 items-center justify-center text-[15px] font-bold text-[#1d2939]">
              {service.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
