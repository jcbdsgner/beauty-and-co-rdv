import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { bookingLink, videoGuideLink } from "@/lib/data/nav";
import { heroServices, type HeroService } from "@/lib/data/services";

function ServiceChip({ service }: { service: HeroService }) {
  const isMulti = service.icons.length > 1;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col items-center gap-2 text-center transition-transform duration-200 hover:scale-110"
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-[rgba(253,207,202,0.3)] transition-colors duration-200 group-hover:bg-[rgba(253,207,202,0.45)]">
        {isMulti ? (
          <div className="flex items-center gap-1">
            {service.icons.map((icon) => (
              <Image key={icon} src={icon} alt="" width={28} height={28} className="size-7" />
            ))}
          </div>
        ) : (
          <Image src={service.icons[0]} alt="" width={40} height={40} className="size-10" />
        )}
      </div>
      <p className="text-[16px] leading-[20px] text-white">{service.label}</p>
    </Link>
  );
}

export function Hero() {
  const [firstRow, secondRow] = [heroServices.slice(0, 3), heroServices.slice(3)];

  return (
    <section className="relative">
      <div className="relative h-[420px] w-full sm:h-[560px] lg:h-[570px]">
        <Image
          src="/images/accueil/hero-bg.png"
          alt="Salon Beauty and Co"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(223,174,175,0.11)]" />
      </div>

      <div className="relative z-10 mx-auto -mt-[496px] w-[88%] max-w-[448px] overflow-hidden rounded-t-[1500px] bg-[#806562] px-8 pb-8 pt-16 sm:-mt-[560px] lg:-mt-[486px]">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 text-center text-white">
              <p className="font-[family-name:var(--font-prata)] text-[36px] leading-[40px]">Et si on prenait</p>
              <p>
                <span className="font-[family-name:var(--font-prata)] text-[36px] leading-[40px]">soin</span>{" "}
                <span className="ml-1.5 font-[family-name:var(--font-benedict)] text-[42px] leading-[40px]">de vous ?</span>
              </p>
            </div>

            <p className="pt-6 text-[22px] leading-[28px] text-white">Nos services</p>

            <div className="grid w-full grid-cols-3 justify-items-center gap-6 pt-8">
              {firstRow.map((service) => (
                <ServiceChip key={service.label} service={service} />
              ))}
            </div>
            <div className="grid w-full grid-cols-2 justify-items-center gap-6 pt-8">
              {secondRow.map((service) => (
                <ServiceChip key={service.label} service={service} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              href={videoGuideLink.href}
              external
              hideExternalIcon
              icon={<Image src="/images/accueil/icon-play.svg" alt="" width={16} height={16} />}
              className="h-9 rounded-full px-8 py-0 text-[18px] font-medium leading-6 text-[#575555] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
            >
              {videoGuideLink.label}
            </Button>
            <Button
              href={bookingLink.href}
              className="h-9 rounded-full px-8 py-0 text-[18px] font-medium leading-6 text-[#575555] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
            >
              {bookingLink.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
