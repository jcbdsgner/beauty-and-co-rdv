import { Hero } from "@/components/sections/hero";
import { Localisation } from "@/components/sections/localisation";
import { GiftCard } from "@/components/sections/gift-card";
import { BoutiqueShowcase } from "@/components/sections/boutique-showcase";
import { AbonnementShowcase } from "@/components/sections/abonnement-showcase";
import { InstagramGallery } from "@/components/sections/instagram-gallery";
import { BookingHelp } from "@/components/sections/booking-help";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Localisation />
      <GiftCard />
      <BoutiqueShowcase />
      <AbonnementShowcase />
      <InstagramGallery />
      <BookingHelp />
    </>
  );
}
