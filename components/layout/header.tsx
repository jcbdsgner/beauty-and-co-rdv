import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ServicesDropdown } from "@/components/layout/services-dropdown";
import { bookingLink, loginLink } from "@/lib/data/nav";

export function Header() {
  return (
    <header className="flex h-[136px] items-center justify-between px-8 py-2">
      <div className="flex items-center gap-8">
        <Logo className="relative h-[120px] w-[120px] shrink-0" />

        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-nav)] text-[19px] text-[var(--on-core-brand-color,#2d2d2d)]"
          >
            Accueil
          </Link>
          <ServicesDropdown />
          <Link
            href="/tarifs"
            className="font-[family-name:var(--font-nav)] text-[19px] text-[var(--on-core-brand-color,#2d2d2d)]"
          >
            Grille tarifaire
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button href={bookingLink.href} variant="outline">
          {bookingLink.label}
        </Button>
        <Button href={loginLink.href} variant="brand">
          {loginLink.label}
        </Button>
      </div>
    </header>
  );
}
