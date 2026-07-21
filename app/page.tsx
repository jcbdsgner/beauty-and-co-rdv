import { Hero } from "@/components/sections/hero";
import { Localisation } from "@/components/sections/localisation";
import { GiftCard } from "@/components/sections/gift-card";
import { BoutiqueShowcase } from "@/components/sections/boutique-showcase";
import { MiniCo } from "@/components/sections/mini-co";
import { InstagramGallery } from "@/components/sections/instagram-gallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Localisation />
      <GiftCard />
      <BoutiqueShowcase />
      <MiniCo />
      <InstagramGallery />
    </>
  );
}
