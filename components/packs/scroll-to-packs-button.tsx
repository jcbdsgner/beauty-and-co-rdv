"use client";

import { useEffect, useState } from "react";

// Aplat rose foncé : texte blanc à 5,4:1 (AA), là où --button-2-color ne donne que 3,9:1.
const ROSE_FILL = "bg-[#8a5f60]";
const GLOW = "shadow-[0_0_0_4px_rgba(255,255,255,0.9),0_0_36px_10px_rgba(162,117,118,0.55),0_10px_24px_rgba(138,95,96,0.45)]";

function DownArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 4v12M5 11l5 5 5-5" />
    </svg>
  );
}

// Pastille flottante de /abonnement : propose de descendre vers #packs, disparaît dès que la section est visible ou dépassée.
// Faite pour ne pas passer inaperçue : aplat rose foncé, liseré blanc, glow, onde qui irradie et étiquette −20 %.
export function ScrollToPacksButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const packs = document.getElementById("packs");
    if (!packs) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top > 0);
    });
    observer.observe(packs);
    return () => observer.disconnect();
  }, []);

  function scrollToPacks() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("packs")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToPacks}
      aria-label="Voir les packs, 20 % moins cher"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 bottom-5 z-40 transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--button-2-color)] motion-reduce:transition-none sm:right-8 sm:bottom-8 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-8 scale-90 opacity-0"
      }`}
    >
      <span aria-hidden className={`packs-ping absolute inset-0 rounded-full ${ROSE_FILL}`} />
      <span
        className={`relative flex items-center gap-3 rounded-full ${ROSE_FILL} ${GLOW} py-3 pr-3 pl-6 text-[17px] font-[600] text-white transition-[scale,background-color] hover:scale-105 hover:bg-[#7d5354] sm:py-3.5 sm:text-[18px]`}
      >
        Voir les Packs
        <span className="rounded-full bg-white px-2 py-0.5 text-[13px] font-bold text-[#8a5f60]">−20&nbsp;%</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-white/25">
          <DownArrow className="size-5 motion-safe:animate-bounce" />
        </span>
      </span>
    </button>
  );
}
