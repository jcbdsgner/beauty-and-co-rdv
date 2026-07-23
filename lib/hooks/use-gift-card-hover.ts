"use client";

import { useRef } from "react";

const HOVER_TRANSITION = "transform 0.3s ease-out";

// The two poses from the matching @keyframes in globals.css (0%/100% = "first", 50% =
// "secondary") — the cards settle on "secondary" for as long as the section is hovered, and ease
// back through "first" on the way out before the idle loop takes back over.
const POSE = {
  first: {
    back: "translate(-2.36%, 6.01%) rotate(-2.1deg)",
    front: "translate(1.46%, 14.46%) rotate(0.07deg)",
  },
  secondary: {
    back: "translate(-3.87%, -7.14%) rotate(-8.15deg)",
    front: "translate(2.48%, 7.43%) rotate(-2.41deg)",
  },
};

/**
 * Drives the gift-card sway/zoom animation. The trigger (mouse enter/leave) is attached by the
 * caller wherever it should fire — the whole section, not just the card image — while this hook
 * owns the refs and the actual transform choreography.
 */
export function useGiftCardHover() {
  const visualRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The idle sway keeps looping in the background regardless of where the hover starts, so a
  // plain CSS `:hover` transform would just snap to the secondary pose. Freezing the *current*
  // computed transform first, then transitioning from there, is what makes it visibly animate
  // over to secondary instead of jumping.
  const handleEnter = () => {
    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = null;
    }
    // Set inline rather than toggling a class: a class only referenced via classList.add/remove
    // (never as a literal JSX className) isn't picked up by Tailwind's content scan and gets
    // pruned from the built CSS.
    if (visualRef.current) visualRef.current.style.transform = "scale(1.1)";
    for (const [ref, target] of [
      [backRef, POSE.secondary.back],
      [frontRef, POSE.secondary.front],
    ] as const) {
      const el = ref.current;
      if (!el) continue;
      const current = getComputedStyle(el).transform;
      el.style.transition = "none";
      el.style.animation = "none";
      el.style.transform = current;
      void el.offsetHeight; // force the frozen transform to commit before the transition below starts
      el.style.transition = HOVER_TRANSITION;
      el.style.transform = target;
    }
  };

  // Ease back out through the "first" pose at the same 0.3s speed instead of snapping straight
  // back into the loop, then hand off to the idle animation once that transition lands — the
  // keyframes' own 0%/100% value is that same "first" pose, so the handoff is seamless.
  const handleLeave = () => {
    if (visualRef.current) visualRef.current.style.transform = "";
    for (const [ref, target] of [
      [backRef, POSE.first.back],
      [frontRef, POSE.first.front],
    ] as const) {
      const el = ref.current;
      if (!el) continue;
      el.style.transition = HOVER_TRANSITION;
      el.style.transform = target;
    }
    resumeTimeout.current = setTimeout(() => {
      for (const ref of [backRef, frontRef]) {
        const el = ref.current;
        if (!el) continue;
        el.style.transition = "";
        el.style.transform = "";
        el.style.animation = "";
      }
      resumeTimeout.current = null;
    }, 300);
  };

  return { visualRef, backRef, frontRef, handleEnter, handleLeave };
}
