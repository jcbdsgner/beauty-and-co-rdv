import Image from "next/image";
import Link from "next/link";
import { ChevronIcon } from "@/components/layout/services-dropdown";
import { tarifCategories, type TarifCategory } from "@/lib/data/tarifs";

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
