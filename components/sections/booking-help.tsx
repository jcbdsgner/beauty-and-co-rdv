import Image from "next/image";
import { Button } from "@/components/ui/button";

/** TODO: remplacer par l'URL réelle de la vidéo une fois disponible. */
const bookingGuideVideoHref = "https://www.youtube.com/watch?v=REPLACE_ME";

export function BookingHelp() {
  return (
    <section className="flex flex-col items-center gap-3 bg-[rgba(253,242,240,0.5)] px-6 py-16 text-center">
      <h2 className="font-[family-name:var(--font-prata)] text-[34px] text-[#575555]">
        Besoin d&apos;aide pour réserver ?
      </h2>
      <p className="max-w-md text-[17px] text-[#806562]">
        Regardez notre guide vidéo rapide pour comprendre comment prendre rendez-vous en quelques clics
      </p>
      <Button
        href={bookingGuideVideoHref}
        external
        hideExternalIcon
        className="mt-3"
        icon={<Image src="/images/accueil/icon-play.svg" alt="" width={16} height={16} />}
      >
        Voir le guide vidéo
      </Button>
    </section>
  );
}
