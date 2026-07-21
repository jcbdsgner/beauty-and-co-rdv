import Image from "next/image";
import { boutiqueHighlights } from "@/lib/data/boutique-highlights";
import { formatPrice } from "@/lib/booking/format";

type BoutiquePreviewSectionProps = {
  reservedProductIds: Set<string>;
  onToggleProduct: (id: string) => void;
};

export function BoutiquePreviewSection({
  reservedProductIds,
  onToggleProduct,
}: BoutiquePreviewSectionProps) {
  return (
    <div className="rounded-2xl border border-[#f2f4f7] bg-white p-6">
      <h3 className="font-[family-name:var(--font-prata)] text-[25px] font-bold text-[#806562]">
        Emportez la beauté du salon chez vous
      </h3>
      <p className="mt-1 text-[17px] text-[#667085]">
        Nos essentiels capillaires, réservés sur place et prêts à repartir avec vous.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {boutiqueHighlights.map((product) => {
          const isReserved = reservedProductIds.has(product.id);
          return (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#f2f4f7]"
            >
              <div className="relative aspect-square w-full border-b border-[#f2f4f7] bg-[#f8f6f9]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-[17px] font-bold text-[#1d2939]">{product.name}</p>
                <span className="flex items-center gap-2 text-[19px] font-bold text-[#806562]">
                  {formatPrice(product.price)}
                  {product.originalPrice !== undefined && (
                    <span className="text-[15px] font-medium text-[#98a2b3] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </span>
                {product.inStock ? (
                  <button
                    type="button"
                    onClick={() => onToggleProduct(product.id)}
                    aria-pressed={isReserved}
                    className={
                      isReserved
                        ? "mt-auto rounded-full border border-[#886666] bg-[#886666] py-2 text-[17px] font-medium text-white transition hover:opacity-90"
                        : "mt-auto rounded-full border border-[#806562] bg-white py-2 text-[17px] font-medium text-[#806562] transition hover:bg-[#806562]/5"
                    }
                  >
                    {isReserved ? "Réservé" : "Réserver"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-auto cursor-not-allowed rounded-full border border-[#f2f4f7] bg-[#f8f6f9] py-2 text-[17px] font-medium text-[#98a2b3]"
                  >
                    Rupture de stock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
