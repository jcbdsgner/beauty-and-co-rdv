import Image from "next/image";
import { Button } from "@/components/ui/button";
import { externalServices } from "@/lib/data/external-services";

const miniCoHref = externalServices.find((service) => service.key === "mini-and-co")!.href;

export function MiniCo() {
  return (
    <section className="flex flex-col-reverse justify-center gap-3 px-6 pb-10 sm:flex-row">
      <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center gap-5 bg-[#f6eefe] px-6 py-16 text-center sm:min-h-[350px] sm:max-w-3xl">
        <h2 className="font-[family-name:var(--font-prata)] text-[27px] text-[var(--on-core-brand-color)] sm:text-[34px]">
          Mini &amp; Co
        </h2>
        <p className="max-w-md text-[17px] text-[var(--text-secondary,var(--text-secondary))]">
          Découvrez l&apos;univers dédié aux petites filles de 4 à 10 ans, alliant bien-être, hygiène et
          confiance en soi dans un cadre ludique et rassurant !
        </p>
        <Button href={miniCoHref} external variant="lilac">
          Découvrir Mini &amp; Co
        </Button>
      </div>

      <div className="relative min-h-[220px] w-full overflow-hidden bg-[var(--brand-lilac)] sm:min-h-[350px] sm:w-[415px]">
        <Image
          src="/images/accueil/mini-co-lifestyle.jpg"
          alt="Univers Mini & Co"
          fill
          sizes="(min-width: 640px) 415px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
