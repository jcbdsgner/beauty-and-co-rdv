import Image from "next/image";
import { Button } from "@/components/ui/button";
import { bookingLink } from "@/lib/data/nav";
import { heroServices } from "@/lib/data/services";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[420px] w-full sm:h-[560px] lg:h-[800px]">
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

      <div className="relative z-10 mx-auto -mt-[496px] w-[88%] max-w-[451px] overflow-hidden rounded-t-[1500px] border border-white/80 bg-[#856a67] px-8 pb-12 pt-16 sm:-mt-[560px] lg:-mt-[656px]">
        <div className="flex flex-col items-center gap-8 sm:gap-12">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-center text-white">
              <span className="font-[family-name:var(--font-prata)] text-[31px] leading-[1.3] sm:text-[39px] lg:text-[43px] lg:leading-[55px]">
                Et si on prenait soin
              </span>{" "}
              <span className="ml-1.5 font-[family-name:var(--font-benedict)] text-[34px] leading-[1.3] sm:text-[42px] lg:text-[48px] lg:leading-[55px]">
                de vous ?
              </span>
            </h1>

            <div className="flex flex-col items-center gap-5">
              <p className="text-[21px] font-medium text-[#fef0ee] sm:text-[25px]">Nos services</p>
              <div className="flex flex-wrap items-start justify-center gap-x-3 gap-y-5">
                {heroServices.map((service) => (
                  <div key={service.label} className="flex w-[105px] flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-3 rounded-full bg-[#9c7d79] p-4">
                      {service.icons.map((icon) => (
                        <Image key={icon} src={icon} alt="" width={48} height={48} />
                      ))}
                    </div>
                    <p className="text-center text-[19px] text-[#f2dedc]">{service.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button href={bookingLink.href} className="w-full max-w-[288px] text-[21px]">
            {bookingLink.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
