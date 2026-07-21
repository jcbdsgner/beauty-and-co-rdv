import Image from "next/image";
import { barBeautyDrinks, barBeautyNote } from "@/lib/data/bar-beauty";
import { formatPrice } from "@/lib/booking/format";

type BarBeautySectionProps = {
  reservedDrinkIds: Set<string>;
  onToggleDrink: (id: string) => void;
};

export function BarBeautySection({ reservedDrinkIds, onToggleDrink }: BarBeautySectionProps) {
  return (
    <div className="rounded-2xl border border-[#f2f4f7] bg-white p-6">
      <h3 className="font-[family-name:var(--font-prata)] text-[25px] font-bold text-[#806562]">
        Le Bar Beauty
      </h3>
      <p className="mt-1 text-[17px] text-[#667085]">
        Envie d&apos;une pause gourmande pendant votre soin ? Réservez votre boisson, elle vous sera
        servie sur place.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {barBeautyDrinks.map((drink) => {
          const isReserved = reservedDrinkIds.has(drink.id);
          return (
            <div
              key={drink.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#f2f4f7]"
            >
              <div className="relative aspect-[24/31] w-full bg-[#f8f6f9]">
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-[17px] font-bold text-[#1d2939]">{drink.name}</p>
                <p className="flex-1 text-[15px] text-[#667085]">{drink.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-bold whitespace-nowrap text-[#1d2939]">
                    {formatPrice(drink.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleDrink(drink.id)}
                    aria-pressed={isReserved}
                    className={
                      isReserved
                        ? "shrink-0 rounded-full border border-[#886666] bg-[#886666] px-4 py-1.5 text-[15px] font-medium whitespace-nowrap text-white transition hover:opacity-90"
                        : "shrink-0 rounded-full border border-[#806562] bg-white px-4 py-1.5 text-[15px] font-medium whitespace-nowrap text-[#806562] transition hover:bg-[#806562]/5"
                    }
                  >
                    {isReserved ? "Réservé" : "Réserver"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[13px] text-[#98a2b3]">{barBeautyNote}</p>
    </div>
  );
}
