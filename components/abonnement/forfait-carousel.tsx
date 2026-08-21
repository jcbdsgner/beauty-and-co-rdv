"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getForfaitPrestations, type Forfait } from "@/lib/data/forfaits";
import { formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(direction === "left" && "rotate-180")}
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ForfaitSlide({ forfait, isActive }: { forfait: Forfait; isActive: boolean }) {
  const prestations = getForfaitPrestations(forfait);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only the selected slide's video actually plays — the peeking neighbours stay paused on
  // their poster frame so an off-screen clip isn't burning bandwidth/battery in the background.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[32px] sm:aspect-[16/9]">
      {forfait.video ? (
        <video
          ref={videoRef}
          aria-hidden
          src={forfait.video}
          poster={forfait.image}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Image
          src={forfait.image}
          alt=""
          fill
          sizes="(min-width: 640px) 74vw, 78vw"
          className="object-cover"
          priority
        />
      )}

      {/* Two independent scrims — one anchors the eyebrow pill at the top, the other anchors the
          text block at the bottom — so contrast holds regardless of what's behind either region,
          instead of one gradient stretched thin over the whole card. */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.35)] sm:p-10">
        <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-[600] tracking-[0.14em] uppercase backdrop-blur-sm">
          {forfait.cycleLabel}
        </span>

        {/* Title, description and CTA travel together as one tight-knit block anchored to the
            bottom — compact by default, so the whole group sits low on the card. The services
            accordion below is genuinely 0-height when closed (not just hidden), so it never
            inflates that default layout — only hovering grows it, which pushes the group's own
            top edge up: title and description visibly rise as the services block grows in. */}
        <div className="flex flex-col gap-3">
          <h2 className="font-[family-name:var(--font-prata)] text-[28px] leading-[1.15] sm:text-[42px]">
            {forfait.label}
          </h2>

          <p className="max-w-md text-[15px] leading-[1.5] text-white/90 sm:text-[17px]">{forfait.description}</p>

          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="mt-1 flex max-h-40 flex-col gap-2.5 overflow-y-auto rounded-2xl bg-black/60 p-3 backdrop-blur-md sm:max-h-48 sm:p-4">
                <p className="text-[11px] font-[600] tracking-[0.12em] text-white/60 uppercase">
                  Inclus dans cet abonnement
                </p>
                {prestations.map((prestation) => (
                  <div key={prestation.id}>
                    <p className="text-[14px] leading-[1.3] font-[600] text-white sm:text-[15px]">
                      {prestation.label}
                    </p>
                    {prestation.description && (
                      <p className="mt-0.5 text-[13px] leading-[1.4] text-white/70">{prestation.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[28px] font-[600] sm:text-[34px]">
              {formatPrice(forfait.price)}
              <span className="ml-1.5 text-[14px] font-[400] text-white/70 sm:text-[15px]">
                / {forfait.cycleLabel.toLowerCase()}
              </span>
            </span>
            <Button href={`/abonnement/${forfait.id}`}>Souscrire</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForfaitCarousel({ forfaits }: { forfaits: Forfait[] }) {
  const [autoplayPlugin] = useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [autoplayPlugin]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- embla's own init pattern: syncs the initially selected slide from the carousel instance it just mounted, before any "select" event has fired.
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {forfaits.map((forfait, index) => {
            const isActive = index === selectedIndex;
            return (
              <div key={forfait.id} className="shrink-0 grow-0 basis-[78%] px-2 sm:basis-[72%] sm:px-4">
                <div
                  // Peeking neighbours are mostly off-canvas slivers — inert keeps their "Souscrire"
                  // link and price out of tab order and unclickable until they become the active slide.
                  inert={!isActive}
                  className={cn("transition-opacity duration-300", isActive ? "opacity-100" : "opacity-35")}
                >
                  <ForfaitSlide forfait={forfait} isActive={isActive} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Abonnement précédent"
        className="absolute top-1/2 left-1 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--on-core-brand-color)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] transition hover:scale-[1.15] sm:left-4 sm:size-12"
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Abonnement suivant"
        className="absolute top-1/2 right-1 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--on-core-brand-color)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] transition hover:scale-[1.15] sm:right-4 sm:size-12"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}
