"use client";

import { useEffect, useState } from "react";

// Pastille flottante de /abonnement : propose de descendre vers #packs, disparaît dès que la section est visible ou dépassée.
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
      aria-label="Voir les packs"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 bottom-5 z-40 flex items-center gap-2 rounded-full bg-[var(--button-2-color)] py-3 pr-4 pl-5 text-[15px] font-[500] text-white shadow-[0_0_24px_6px_rgba(162,117,118,0.45),0_4px_12px_rgba(162,117,118,0.35)] transition-[opacity,translate] duration-300 hover:bg-[#8a5f60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--button-2-color)] motion-reduce:transition-none sm:right-8 sm:bottom-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      Voir les packs
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5 motion-safe:animate-bounce"
      >
        <path d="M10 4v12M5 11l5 5 5-5" />
      </svg>
    </button>
  );
}
