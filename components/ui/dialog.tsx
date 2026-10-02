"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  labelledBy: string;
  role?: "dialog" | "alertdialog";
  overlayClassName?: string;
  className?: string;
  /** When set, a click on the backdrop or Escape dismisses the dialog. */
  onClose?: () => void;
  children: React.ReactNode;
};

/** Shared fixed-overlay + centered-panel shell for the app's modals. Only the structural boilerplate (positioning, centering, aria wiring) is fixed — border, radius, shadow, width and overlay tint stay per-dialog via className/overlayClassName since they currently differ between dialogs. */
export function Dialog({ open, labelledBy, role = "dialog", overlayClassName, className, onClose, children }: DialogProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4", overlayClassName)}
      onMouseDown={onClose ? (event) => event.target === event.currentTarget && onClose() : undefined}
    >
      <div role={role} aria-modal="true" aria-labelledby={labelledBy} className={cn("w-full bg-white", className)}>
        {children}
      </div>
    </div>
  );
}
