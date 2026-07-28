import { notFound } from "next/navigation";
import { SouscriptionFlow } from "@/components/abonnement/souscription-flow";
import { forfaits } from "@/lib/data/forfaits";

export default async function SouscriptionPage({ params }: { params: Promise<{ forfaitId: string }> }) {
  const { forfaitId } = await params;
  const forfait = forfaits.find((item) => item.id === forfaitId);

  if (!forfait) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SouscriptionFlow forfait={forfait} />
    </section>
  );
}
