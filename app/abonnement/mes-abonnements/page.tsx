import { redirect } from "next/navigation";

/** Mes Abonnements now lives inside the Compte hub (see app/compte) — this route stays only so old links/bookmarks still land somewhere. */
export default function MesAbonnementsPage() {
  redirect("/compte?panel=abonnements");
}
