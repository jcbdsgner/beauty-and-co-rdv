import Image from "next/image";

type LogoProps = {
  size?: "header" | "footer";
  className?: string;
};

export function Logo({ size = "header", className }: LogoProps) {
  const isFooter = size === "footer";

  return (
    <div className={className}>
      <Image
        src={isFooter ? "/images/accueil/logo-bc-2.png" : "/images/accueil/logo-bc-1.png"}
        alt="Beauty and Co"
        width={isFooter ? 120 : 232}
        height={isFooter ? 109 : 211}
        className="h-full w-full object-contain"
        priority={!isFooter}
      />
    </div>
  );
}
