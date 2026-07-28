"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/layout/account-menu";
import { ChevronIcon, ServicesDropdown } from "@/components/layout/services-dropdown";
import { footerServices } from "@/lib/data/services";
import { bookingLink, loginLink, accountLink } from "@/lib/data/nav";
import { logout, useAccount } from "@/lib/account/persistence";
import { cn } from "@/lib/utils";

const navLinkClassName = "font-[family-name:var(--font-nav)] text-[18px] text-[var(--on-core-brand-color,var(--on-core-brand-color))]";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTarifs = pathname === "/tarifs";
  const isAbonnement = pathname.startsWith("/abonnement");
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const account = useAccount();
  const connected = account?.connected ?? false;

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
          <Link
            href="/"
            className={cn(navLinkClassName, "relative", isHome && "text-[var(--core-brand-color,var(--core-brand-color))]")}
          >
            Accueil
            {isHome && (
              <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--core-brand-color,var(--core-brand-color))]" />
            )}
          </Link>
          <ServicesDropdown />
          <Link
            href="/tarifs"
            className={cn(navLinkClassName, "relative", isTarifs && "text-[var(--core-brand-color,var(--core-brand-color))]")}
          >
            Grille tarifaire
            {isTarifs && (
              <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--core-brand-color,var(--core-brand-color))]" />
            )}
          </Link>
          <Link
            href="/abonnement"
            className={cn(navLinkClassName, "relative", isAbonnement && "text-[var(--core-brand-color,var(--core-brand-color))]")}
          >
            Abonnements
            {isAbonnement && (
              <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--core-brand-color,var(--core-brand-color))]" />
            )}
          </Link>
        </nav>
      </div>

      <div className="hidden items-center gap-3 lg:flex">
        <Button href={bookingLink.href} variant="brand">
          {bookingLink.label}
        </Button>
        {connected && account ? (
          <AccountMenu account={account} />
        ) : (
          <Button href={loginLink.href} variant="outline">
            {loginLink.label}
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
        className="flex size-11 items-center justify-center rounded-lg text-[var(--on-core-brand-color)] transition hover:bg-black/5 lg:hidden"
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
            className="flex size-11 items-center justify-center rounded-lg text-[var(--color-gray-500)] transition hover:bg-black/5"
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
            className={cn(
              "rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px]",
              isHome ? "text-[var(--core-brand-color,var(--core-brand-color))]" : "text-[var(--on-core-brand-color)]",
            )}
          >
            Accueil
          </Link>
          <Link
            href="/tarifs"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px]",
              isTarifs ? "text-[var(--core-brand-color,var(--core-brand-color))]" : "text-[var(--on-core-brand-color)]",
            )}
          >
            Grille tarifaire
          </Link>
          <Link
            href="/abonnement"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px]",
              isAbonnement ? "text-[var(--core-brand-color,var(--core-brand-color))]" : "text-[var(--on-core-brand-color)]",
            )}
          >
            Abonnements
          </Link>

          <button
            type="button"
            onClick={() => setServicesOpen((v) => !v)}
            aria-expanded={servicesOpen}
            className={cn(
              "mt-3 flex items-center justify-between rounded-lg px-2 py-3 font-[family-name:var(--font-nav)] text-[19px] transition-colors",
              servicesOpen ? "text-[var(--core-brand-color,var(--core-brand-color))]" : "text-[var(--on-core-brand-color)]",
            )}
          >
            Services
            <ChevronIcon className={cn("transition-transform", servicesOpen ? "rotate-90" : "-rotate-90")} />
          </button>
          {servicesOpen && (
            <div className="flex flex-col">
              {footerServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-[17px] text-[var(--on-core-brand-color)]"
                >
                  {service.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {connected && account ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-gray-200)] p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[rgba(162,117,118,0.5)] bg-[rgba(253,207,202,0.2)] text-[16px] font-semibold text-[var(--button-2-color)]">
                  {account.firstName.charAt(0).toUpperCase() || "?"}
                </span>
                <p className="truncate text-[17px] font-bold text-[var(--color-gray-900)]">
                  {`${account.firstName} ${account.lastName}`.trim()}
                </p>
              </div>
              <Link
                href={accountLink.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[var(--color-border-light)] px-4 py-2.5 text-center text-[16px] font-[450] text-[var(--text-secondary)]"
              >
                {accountLink.label}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-center text-[16px] font-[450] text-[var(--color-gray-500)]"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <Button href={loginLink.href} variant="outline" className="w-full">
              {loginLink.label}
            </Button>
          )}
          <Button href={bookingLink.href} variant="brand" className="w-full">
            {bookingLink.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
