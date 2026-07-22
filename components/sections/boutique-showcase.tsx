import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { externalServices } from "@/lib/data/external-services";
import { boutiqueShowcaseProducts } from "@/lib/data/boutique-showcase";

const boutiqueHref = externalServices.find((service) => service.key === "boutique")!.href;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, rating - index));
        return (
          <svg key={index} viewBox="0 0 24 24" className="size-6 shrink-0">
            <defs>
              <linearGradient id={`star-fill-${index}`}>
                <stop offset={`${fill * 100}%`} stopColor="#b39922" />
                <stop offset={`${fill * 100}%`} stopColor="#e1e1e1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-fill-${index})`}
              d="M12 2.5l2.9 6.2 6.6.7-5 4.6 1.4 6.6L12 17.3l-5.9 3.3 1.4-6.6-5-4.6 6.6-.7L12 2.5z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function ProductPrice({ price, originalPrice }: { price: number; originalPrice?: number }) {
  const priceLabel = price + " FCFA";
  const originalPriceLabel = originalPrice !== undefined ? originalPrice + " FCFA" : null;

  return (
    <div className="flex items-center gap-2 text-[22px]">
      <span className="font-[450] text-[#303030]">{priceLabel}</span>
      {originalPriceLabel && <span className="text-[#afafaf] line-through">{originalPriceLabel}</span>}
    </div>
  );
}

export function BoutiqueShowcase() {
  return (
    <section className="flex flex-col items-center gap-10 px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-[family-name:var(--font-prata)] text-[27px] text-[#2d2d2d] sm:text-[34px]">
          Notre boutique en ligne
        </h2>
        <p className="max-w-md text-[17px] text-[var(--text-secondary,#344054)]">
          Retrouvez notre sélection de produits capillaires et de beauté, à commander directement sur
          notre boutique.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
        {boutiqueShowcaseProducts.map((product) => (
          <Link
            key={product.id}
            href={product.href ?? boutiqueHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-3"
          >
            <div className="relative h-[280px] w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/[.15]" />
              {product.discountBadge && (
                <span className="absolute top-[10px] left-[10px] border border-[#fdfdfd] bg-white px-2 py-1 font-[family-name:var(--font-prata)] text-[13px] text-[#303030]">
                  {product.discountBadge}
                </span>
              )}
            </div>

            <p className="capitalize text-[18px] text-[#303030]">{product.name}</p>

            <ProductPrice price={product.price} originalPrice={product.originalPrice} />

            <div className="flex items-center gap-2">
              <Stars rating={product.rating} />
              <p className="text-[18px] text-[#525252]">({product.reviewCount})</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="size-5 rounded-full border border-[#e1e1e1]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {product.extraColors !== undefined && (
                <p className="text-[18px] text-[#525252]">+{product.extraColors}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Button href={boutiqueHref} external>
        Voir la boutique
      </Button>
    </section>
  );
}
