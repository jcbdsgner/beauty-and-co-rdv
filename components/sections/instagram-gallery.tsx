import Image from "next/image";
import { Button } from "@/components/ui/button";
import { galleryImages } from "@/lib/data/gallery";

export function InstagramGallery() {
  return (
    <section className="flex flex-col items-center gap-8 bg-[var(--core-brand-color-2,#eddcda)] px-6 py-12">
      <h2 className="text-center font-[family-name:var(--font-prata)] text-[27px] text-[#2d2d2d] sm:text-[35px]">
        Un aperçu de notre univers
      </h2>

      <div className="grid w-full max-w-[960px] grid-cols-2 sm:grid-cols-3">
        {galleryImages.map((src) => (
          <div key={src} className="relative aspect-square border-[0.5px] border-[#f8f6f9]">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 320px, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <Button href="https://instagram.com" variant="gradient" className="text-[21px]">
        Découvrir plus sur Instagram
      </Button>
    </section>
  );
}
