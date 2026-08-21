import Image from "next/image";
import Link from "next/link";
import { ChevronIcon } from "@/components/layout/services-dropdown";
import { PackBuyButton } from "@/components/tarifs/pack-buy-button";
import { formatPrice } from "@/lib/booking/format";
import { tarifCategories, type TarifCategory } from "@/lib/data/tarifs";
import { getPackPrestations, getPackPrice, packs } from "@/lib/data/packs";

function TarifCard({ category }: { category: TarifCategory }) {
  return (
    <Link
      href={`/services/${category.slug}`}
      className="group flex aspect-[218/45] items-center justify-between overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white p-6 transition-colors hover:border-[var(--brand-taupe-muted)]/50"
    >
      <div className="flex items-center">
        <span className="mr-5 flex size-16 shrink-0 items-center justify-center rounded-full bg-[rgba(237,220,218,0.4)]">
          <Image
            src={category.icon}
            alt=""
            width={36}
            height={36}
            className={category.iconOnly ? "size-9 object-contain" : "size-9 object-cover"}
          />
        </span>
        <span className="font-[family-name:var(--font-nav)] text-[22px] text-[var(--brand-taupe-muted)]">
          {category.label}
        </span>
      </div>
      <ChevronIcon className="size-6 shrink-0 rotate-180 text-[var(--color-gray-400)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function PackCard({ pack }: { pack: (typeof packs)[number] }) {
  const prestations = getPackPrestations(pack);
  const price = getPackPrice(pack);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white">
      <div className="relative aspect-[4/3] w-full shrink-0">
        {pack.video ? (
          <video
            aria-hidden
            src={pack.video}
            poster={pack.image}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            src={pack.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-[family-name:var(--font-nav)] text-[19px] font-bold text-[var(--brand-taupe-muted)]">
          {pack.label}
        </p>
        <p className="mt-1.5 text-[14px] leading-[1.4] text-[var(--color-gray-500)]">{pack.description}</p>

        <ul className="mt-4 flex flex-col gap-1.5">
          {prestations.map((prestation) => (
            <li key={prestation.id} className="flex items-start gap-2 text-[14px] text-[var(--color-gray-600)]">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[var(--brand-taupe-muted)]/50" />
              <span>{prestation.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-1 flex-col items-start justify-end gap-3">
          <p className="text-[21px] font-bold text-[var(--color-gray-800)]">{formatPrice(price)}</p>
          <PackBuyButton pack={pack} />
        </div>
      </div>
    </div>
  );
}

export default function TarifsPage() {
  return (
    <>
      <section className="relative flex h-[294px] items-center justify-center overflow-hidden sm:h-[364px] lg:h-[420px]">
        <Image
          src="/images/tarifs/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="relative z-10 flex w-[92%] max-w-[720px] items-center justify-center border-[16px] border-[rgba(255,255,255,0.6)] bg-[rgba(237,220,218,0.3)] sm:border-[24px]">
          <div className="w-full bg-white px-8 py-8 sm:px-14 sm:py-10">
            <h1 className="text-center font-[family-name:var(--font-prata)] text-[30px] uppercase tracking-[0.06em] text-[var(--brand-taupe-muted)] sm:whitespace-nowrap sm:text-[38px] lg:text-[42px]">
              Grille tarifaire
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[rgba(237,220,218,0.25)] px-4 py-16 sm:py-20">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center">
          <h2 className="text-center font-[family-name:var(--font-prata)] text-[28px] text-[var(--color-gray-800)] sm:text-[36px]">
            Découvrez nos packs
          </h2>
          <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1280px] flex-col items-center sm:mt-20">
          <h2 className="text-center font-[family-name:var(--font-prata)] text-[28px] text-[var(--color-gray-800)] sm:text-[36px]">
            Découvrez nos tarifs
          </h2>
          <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {tarifCategories.map((category) => (
              <TarifCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
