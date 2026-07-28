"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { externalServices } from "@/lib/data/external-services";
import { boutiqueShowcaseProducts } from "@/lib/data/boutique-showcase";
import { cn } from "@/lib/utils";

const boutiqueHref = externalServices.find((service) => service.key === "boutique")!.href;

/**
 * Embla silently falls back to a non-looping carousel when the slide track
 * isn't wide enough to loop smoothly (see `canLoop` in embla-carousel's
 * source) — with only a handful of real products that's the case as soon as
 * most of them fit in one viewport. Repeating the catalog pads the track
 * without adding fake products to the data.
 */
const LOOP_REPEAT = 3;
const carouselProducts = Array.from({ length: LOOP_REPEAT }, () => boutiqueShowcaseProducts).flat();

function ProductPrice({ price, originalPrice }: { price: number; originalPrice?: number }) {
  const priceLabel = `${price.toLocaleString("fr-FR")} FCFA`;
  const originalPriceLabel = originalPrice !== undefined ? `${originalPrice.toLocaleString("fr-FR")} FCFA` : null;

  return (
    <div className="flex items-center gap-2 text-[19px]">
      <span className="font-bold text-[var(--color-near-black)]">{priceLabel}</span>
      {originalPriceLabel && <span className="font-bold text-[#afafaf] line-through">{originalPriceLabel}</span>}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(direction === "left" && "rotate-180")}
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BoutiqueShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="flex flex-col items-center gap-10 bg-white px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-[family-name:var(--font-prata)] text-[27px] text-[var(--on-core-brand-color)] sm:text-[34px]">
          Notre sélection de produits
        </h2>
      </div>

      <div className="relative w-full max-w-5xl">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {carouselProducts.map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href={product.href ?? boutiqueHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[411/442] w-[75%] shrink-0 overflow-hidden rounded-[1px] bg-[var(--color-bg-subtle)] shadow-[0px_0px_24px_0px_rgba(16,24,40,0.05)] sm:w-[calc(33.333%-1rem)]"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 75vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.discountBadge && (
                  <span className="absolute top-[1.5%] left-[2.5%] rounded-full bg-[var(--button-2-color)] px-3 py-1.5 text-[15px] font-[500] text-white sm:text-[18px]">
                    {product.discountBadge}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex h-[100px] flex-col justify-end gap-1 bg-white px-[10%] pb-[13px]">
                  <p className="truncate text-[18px] text-[var(--color-near-black)] capitalize sm:text-[21px]">{product.name}</p>
                  <ProductPrice price={product.price} originalPrice={product.originalPrice} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Produits précédents"
          className="absolute top-1/2 left-2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--on-core-brand-color)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] transition hover:scale-[1.15] sm:flex"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Produits suivants"
          className="absolute top-1/2 right-2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--on-core-brand-color)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] transition hover:scale-[1.15] sm:flex"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <Button href={boutiqueHref} external>
        Explorer la boutique
      </Button>
    </section>
  );
}
