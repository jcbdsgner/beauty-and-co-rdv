import Image from "next/image";
import type { RefObject } from "react";

type GiftCardVisualProps = {
  visualRef: RefObject<HTMLDivElement | null>;
  backRef: RefObject<HTMLDivElement | null>;
  frontRef: RefObject<HTMLDivElement | null>;
};

export function GiftCardVisual({ visualRef, backRef, frontRef }: GiftCardVisualProps) {
  return (
    <div ref={visualRef} className="gift-card-visual relative h-full w-full">
      <div className="gift-card-layer">
        <div className="flex h-full w-full items-center justify-center">
          <div ref={backRef} className="gift-card-face gift-card-face--back">
            <Image src="/images/accueil/carte-cadeau-back.png" alt="" fill sizes="380px" className="object-cover" />
          </div>
        </div>
      </div>
      <div className="gift-card-layer">
        <div className="flex h-full w-full items-center justify-center">
          <div ref={frontRef} className="gift-card-face gift-card-face--front">
            <Image
              src="/images/accueil/carte-cadeau-front.png"
              alt="Carte cadeau Beauty and Co"
              fill
              sizes="380px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
