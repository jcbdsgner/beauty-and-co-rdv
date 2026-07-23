import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { externalServices } from "@/lib/data/external-services";
import { boutiqueShowcaseProducts } from "@/lib/data/boutique-showcase";

const boutiqueHref = externalServices.find((service) => service.key === "boutique")!.href;

function ProductPrice({ price, originalPrice }: { price: number; originalPrice?: number }) {
  const priceLabel = price + " FCFA";
  const originalPriceLabel = originalPrice !== undefined ? originalPrice + " FCFA" : null;

  return (
    <div className="flex items-center gap-2 text-[19px]">
      <span className="font-bold text-[#303030]">{priceLabel}</span>
      {originalPriceLabel && <span className="font-bold text-[#afafaf] line-through">{originalPriceLabel}</span>}
    </div>
  );
}

export function BoutiqueShowcase() {
  return (
    <section className="flex flex-col items-center gap-10 bg-white px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-[family-name:var(--font-prata)] text-[27px] text-[#2d2d2d] sm:text-[34px]">
          Notre sélection de produits
        </h2>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {boutiqueShowcaseProducts.map((product) => (
          <Link
            key={product.id}
            href={product.href ?? boutiqueHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[411/442] w-full overflow-hidden rounded-[1px] bg-[#f7f8fa] shadow-[0px_34px_74px_0px_rgba(123,123,123,0.2)]"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.discountBadge && (
              <span className="absolute top-[1.5%] left-[2.5%] rounded-full bg-[#a27576] px-3 py-1.5 text-[15px] font-[500] text-white sm:text-[18px]">
                {product.discountBadge}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex h-[100px] flex-col justify-end gap-1 bg-white px-[10%] pb-[13px]">
              <p className="truncate text-[18px] text-[#303030] capitalize sm:text-[21px]">{product.name}</p>
              <ProductPrice price={product.price} originalPrice={product.originalPrice} />
            </div>
          </Link>
        ))}
      </div>

      <Button href={boutiqueHref} external>
        Explorer la boutique
      </Button>
    </section>
  );
}
