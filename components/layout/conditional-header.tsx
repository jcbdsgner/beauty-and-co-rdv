"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/rdv") || pathname?.startsWith("/connexion")) return null;
  return <Header />;
}
