import Image from "next/image";
import { cn } from "@/lib/utils";

export type CategoryTile = {
  id: string;
  label: string;
  image: string;
  /** True when `image` is a small pictogram (24px) rather than a photo swatch (44px). */
  iconOnly?: boolean;
};

type CategoryTilesProps = {
  tiles: CategoryTile[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  categoriesWithSelection: Set<string>;
};

export function CategoryTiles({
  tiles,
  activeCategoryId,
  onSelectCategory,
  categoriesWithSelection,
}: CategoryTilesProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => {
        const isActive = tile.id === activeCategoryId;
        // Only checked once a prestation was actually picked from it — merely opening a category
        // shows it as active (border) without implying anything was chosen there.
        const checked = categoriesWithSelection.has(tile.id);

        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => onSelectCategory(tile.id)}
            aria-pressed={isActive}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-white px-2 py-[18px] xl:px-3.5 text-center transition",
              isActive ? "border-[var(--brand-taupe-muted)]" : "border-[var(--color-gray-300)] hover:border-[var(--brand-taupe-muted)]/50",
            )}
          >
            <span
              className={cn(
                "absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-lg border-[1.5px] transition",
                checked ? "border-[var(--brand-taupe-muted)] bg-[var(--brand-taupe-muted)]" : "border-[var(--color-gray-300)] bg-white",
              )}
            >
              {checked && <Image src="/images/rdv/icon-check.svg" alt="" width={14} height={14} />}
            </span>
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-[rgba(237,220,218,0.4)]">
              <Image
                src={tile.image}
                alt=""
                width={tile.iconOnly ? 24 : 44}
                height={tile.iconOnly ? 24 : 44}
                className={tile.iconOnly ? undefined : "size-full object-cover"}
              />
            </span>
            <span className="flex min-h-10 items-center justify-center text-[15px] font-bold xl:text-[17px] text-[var(--color-gray-800)] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
              {tile.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
