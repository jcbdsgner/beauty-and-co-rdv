import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { bookingLink, videoGuideLink } from "@/lib/data/nav";
import { heroServices, type HeroService } from "@/lib/data/services";

function ServiceChip({ service }: { service: HeroService }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex w-[105px] flex-col items-center gap-2 transition-transform duration-200 hover:scale-110"
    >
      <div className="flex items-center justify-center gap-1.5 rounded-full bg-[#9c7d79] p-3 transition-colors duration-200 group-hover:bg-[#ab8985] sm:p-4">
        {service.icons.map((icon) => (
          <Image key={icon} src={icon} alt="" width={48} height={48} className="h-7 w-7 sm:h-8 sm:w-8" />
        ))}
      </div>
      <p className="text-center text-[19px] text-[#f2dedc]">{service.label}</p>
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

      <div className="relative z-10 mx-auto -mt-[496px] w-[88%] max-w-[451px] overflow-hidden rounded-t-[1500px] border border-white/80 bg-[#856a67] px-8 pb-12 pt-16 sm:-mt-[560px] lg:-mt-[486px] lg:px-12 lg:pt-20">
        <div className="flex flex-col items-center gap-8 sm:gap-12">
          <div className="flex flex-col items-center gap-6">
            <h1 className="px-[30px] py-[14px] text-center text-white lg:p-0">
              <span className="font-[family-name:var(--font-prata)] text-[31px] leading-[1.3] sm:text-[39px] lg:text-[39px] lg:leading-[55px]">
                Et si on prenait soin
              </span>{" "}
              <span className="ml-1.5 font-[family-name:var(--font-benedict)] text-[34px] leading-[1.3] sm:text-[42px] lg:text-[44px] lg:leading-[55px]">
                de vous ?
              </span>
            </h1>

            <div className="flex flex-col items-center gap-5">
              <p className="text-[21px] font-[450] text-[#fef0ee] sm:text-[25px]">Nos services</p>
              <div className="flex flex-col items-center gap-5">
                <div className="flex items-start justify-center gap-x-3">
                  {firstRow.map((service) => (
                    <ServiceChip key={service.label} service={service} />
                  ))}
                </div>
                <div className="flex items-start justify-center gap-x-3">
                  {secondRow.map((service) => (
                    <ServiceChip key={service.label} service={service} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[288px] flex-col items-center gap-3">
            <Button
              href={videoGuideLink.href}
              external
              hideExternalIcon
              icon={<Image src="/images/accueil/icon-play.svg" alt="" width={16} height={16} />}
              className="w-full"
            >
              {videoGuideLink.label}
            </Button>
            <Button href={bookingLink.href} className="w-full">
              {bookingLink.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
