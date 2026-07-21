import Image from "next/image";
import { Button } from "@/components/ui/button";
import { externalServices } from "@/lib/data/external-services";

const giftCardHref = externalServices.find((service) => service.key === "carte-cadeau")!.href;

export function GiftCard() {
  return (
    <section className="flex justify-center bg-[#fff1f1] px-6 py-16 sm:py-24">
      <div className="flex max-w-4xl flex-col items-center gap-10 sm:flex-row sm:gap-16">
        <div className="relative h-[226px] w-[260px] shrink-0 sm:h-[279px] sm:w-[320px]">
          <Image
            src="/images/accueil/gift-card.png"
            alt="Carte cadeau Beauty and Co"
            fill
            sizes="320px"
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
          <h2 className="font-[family-name:var(--font-prata)] text-[27px] text-[#2d2d2d] sm:text-[34px]">
            Offrez un moment beauté
          </h2>
          <p className="max-w-md text-[17px] text-[var(--text-secondary,#344054)]">
            La carte cadeau Beauty and Co, valable dans tous nos salons et sur l&apos;ensemble de nos
            prestations.
          </p>
          <Button href={giftCardHref} external>
            Découvrir la carte cadeau
          </Button>
        </div>
      </div>
    </section>
  );
}
