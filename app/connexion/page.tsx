"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hasBookingDraft } from "@/lib/booking/persistence";

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.63H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.37l4-3.09Z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4 3.09C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="#000"
        d="M17.05 12.34c-.02-2.06 1.68-3.05 1.76-3.1-1.36-1.98-3.75-2.11-4.36-1.02-1.03-.13-1.98.62-2.5.62-.53 0-1.35-.6-2.22-.59-1.14.02-2.2.67-2.78 1.7-1.19 2.07-.3 5.12.85 6.8.56.82 1.23 1.74 2.11 1.71.85-.03 1.17-.55 2.19-.55 1.02 0 1.31.55 2.2.53.91-.02 1.49-.83 2.05-1.65.65-.95.91-1.87.92-1.92-.02-.01-1.77-.68-1.79-2.71l-.03.18Z"
      />
      <path
        fill="#000"
        d="M15.4 6.5c.47-.57.79-1.36.7-2.15-.68.03-1.5.45-1.99 1.02-.44.5-.82 1.31-.72 2.08.75.06 1.53-.38 2.01-.95Z"
      />
    </svg>
  );
}

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // No real auth is wired up yet — any of the three actions below is treated as a successful
  // login. If the user got here mid-booking (via "Se connecter" on the informations step),
  // send them back to /rdv, which resumes right where they left off; otherwise just go home.
  const handleLoginSuccess = () => {
    router.push(hasBookingDraft() ? "/rdv" : "/");
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center gap-6 bg-[#f9fafb] px-4 py-12">
      <div className="flex w-full max-w-[510px] flex-col items-center gap-8 rounded-2xl bg-white px-4 py-6">
        <h1 className="w-full text-[26px] font-bold text-[#101828]">Connectez-vous</h1>

        <form
          className="flex w-full flex-col items-center gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleLoginSuccess();
          }}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor="email" className="text-[15px] font-medium text-[#344054]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="andiaye@gmail.com"
                className="w-full rounded-full border border-[#d0d5dd] px-3.5 py-2.5 text-[18px] text-[#2d2d2d] shadow-[0px_1px_1px_0px_rgba(16,24,40,0.05)] outline-none focus:border-[#886666]"
              />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor="password" className="text-[15px] font-medium text-[#344054]">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-full border border-[#d0d5dd] px-3.5 py-2.5 text-[18px] text-[#2d2d2d] shadow-[0px_1px_1px_0px_rgba(16,24,40,0.05)] outline-none focus:border-[#886666]"
              />
            </div>
          </div>

          <button type="button" className="w-full text-left text-[16px] font-bold text-[#a27576]">
            Avez-vous oublié votre mot de passe ?
          </button>

          <button
            type="submit"
            className="w-full rounded-full bg-[#fdcfca] px-4 py-3 text-[17px] font-medium text-[#344054] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90"
          >
            Se connecter
          </button>

          <div className="flex w-full items-center gap-2">
            <span className="h-px flex-1 bg-[#eaecf0]" />
            <span className="text-[15px] font-medium text-[#475467]">Ou</span>
            <span className="h-px flex-1 bg-[#eaecf0]" />
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleLoginSuccess}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#eaecf0] bg-white px-4 py-2.5 text-[18px] font-bold text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition hover:bg-black/[.02]"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
            <button
              type="button"
              onClick={handleLoginSuccess}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#eaecf0] bg-white px-4 py-2.5 text-[18px] font-bold text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition hover:bg-black/[.02]"
            >
              <AppleIcon />
              Continuer avec Apple
            </button>
          </div>

          <p className="flex items-start justify-center gap-1 text-[16px] text-[#475467]">
            Vous n&apos;avez pas de compte?
            <button type="button" className="font-bold text-[#a27576]">
              Créer un compte
            </button>
          </p>
        </form>
      </div>

      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Fermer"
        className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-lg bg-white text-[#667085] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition hover:bg-[#f2f4f7] hover:text-[#344054]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  );
}
