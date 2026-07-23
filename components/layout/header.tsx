"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ServicesDropdown } from "@/components/layout/services-dropdown";
import { footerServices } from "@/lib/data/services";
import { bookingLink, loginLink } from "@/lib/data/nav";
import { cn } from "@/lib/utils";

const navLinkClassName = "font-[family-name:var(--font-nav)] text-[18px] text-[var(--on-core-brand-color,#2d2d2d)]";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Closing on route change would need a router event, but the simplest reliable rule here is:
  // whenever the mobile menu is open, lock page scroll so it doesn't move behind the overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="relative flex h-24 items-center justify-between px-4 py-2 sm:px-8">
      <div className="flex items-center gap-8">
        <Link href="/" aria-label="Retour à l'accueil" className="shrink-0">
          <Logo className="relative h-16 w-16 shrink-0" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className={navLinkClassName}>
            Accueil
          </Link>
          <ServicesDropdown />
          <Link href="/tarifs" className={navLinkClassName}>
            Grille tarifaire
          </Link>
        </nav>
      </div>

      <div className="hidden items-center gap-3 lg:flex">
        <Button href={bookingLink.href} variant="outline">
          {bookingLink.label}
        </Button>
        <Button href={loginLink.href} variant="brand">
          {loginLink.label}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
        className="flex size-11 items-center justify-center rounded-lg text-[#2d2d2d] transition hover:bg-black/5 lg:hidden"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[360px] flex-col gap-8 bg-white px-6 py-6 shadow-[-4px_0px_24px_rgba(0,0,0,0.1)] transition-transform duration-300 lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Retour à l'accueil" onClick={() => setMenuOpen(false)}>
            <Logo className="relative h-14 w-14" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
            className="flex size-11 items-center justify-center rounded-lg text-[#667085] transition hover:bg-black/5"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px] text-[#2d2d2d]"
          >
            Accueil
          </Link>
          <Link
            href="/tarifs"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px] text-[#2d2d2d]"
          >
            Grille tarifaire
          </Link>

          <button
            type="button"
            onClick={() => setServicesOpen((v) => !v)}
            aria-expanded={servicesOpen}
            className="mt-3 flex items-center justify-between rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px] text-[#2d2d2d]"
          >
            Services
            <Image
              src="/images/accueil/icon-chevron-left.svg"
              alt=""
              width={24}
              height={24}
              className={cn("transition-transform", servicesOpen ? "rotate-90" : "-rotate-90")}
            />
          </button>
          {servicesOpen && (
            <div className="flex flex-col">
              {footerServices.map((service) => (
                <Link
                  key={service}
                  href="/services"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-[17px] text-[#2d2d2d]"
                >
                  {service}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Button href={bookingLink.href} variant="outline" className="w-full">
            {bookingLink.label}
          </Button>
          <Button href={loginLink.href} variant="brand" className="w-full">
            {loginLink.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
