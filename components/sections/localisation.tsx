import Image from "next/image";
import { Button } from "@/components/ui/button";
import { locations } from "@/lib/data/locations";

export function Localisation() {
  return (
    <section className="flex flex-col items-center gap-4 pb-12 pt-6 sm:px-12">
      <h2 className="px-6 text-center font-[family-name:var(--font-prata)] text-[27px] text-[#404040] sm:px-0 sm:text-[35px]">
        Retrouvez-nous dans nos salons
      </h2>

      <div className="relative flex min-h-[420px] w-full items-center justify-center sm:min-h-[560px] lg:min-h-[676px]">
        <Image
          src="/images/accueil/beauty-co-storefront.jpg"
          alt="Salon Beauty and Co"
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 px-4 py-8">
          {locations.map((location) => (
            <div
              key={location.name}
              className="flex h-[422px] w-[359px] max-w-full flex-col items-center justify-center gap-6 border border-[var(--brand-rose-soft)] bg-[rgba(87,85,85,0.75)] px-8"
            >
              <p className="text-center font-[family-name:var(--font-prata)] text-[39px] text-[#fdf2f0] sm:text-[51px]">
                {location.name}
              </p>
              <p className="text-center text-[21px] text-[#fbfbfb]">{location.hours}</p>

              <div className="flex w-full max-w-[283px] flex-col items-center gap-3">
                <Button
                  href="tel:+22178120868"
                  variant="brand"
                  className="w-full justify-center py-2 text-[17px]"
                  icon={<Image src="/images/accueil/icon-call.svg" alt="" width={20} height={20} />}
                >
                  Appeler
                </Button>
                <Button
                  href="https://maps.google.com"
                  variant="outline"
                  className="w-full justify-center py-2 text-[17px]"
                  icon={<Image src="/images/accueil/icon-find-big.svg" alt="" width={20} height={20} />}
                >
                  Localiser
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
