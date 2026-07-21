import type { Metadata } from "next";
import { Prata } from "next/font/google";
import localFont from "next/font/local";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const cabinetGrotesk = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet-grotesk",
  weight: "100 900",
});

const prata = Prata({
  variable: "--font-prata",
  weight: "400",
  subsets: ["latin"],
});

const benedict = localFont({
  src: "./fonts/Benedict-Regular.otf",
  variable: "--font-benedict",
});

export const metadata: Metadata = {
  title: "B&Co — Salon de beauté",
  description: "Réservez votre rendez-vous chez B&Co.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cabinetGrotesk.variable} ${prata.variable} ${benedict.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConditionalHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
