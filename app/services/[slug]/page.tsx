import { notFound } from "next/navigation";
import { footerServices } from "@/lib/data/services";
import { tarifCategories } from "@/lib/data/tarifs";

const allServices = [...footerServices, ...tarifCategories.map(({ slug, label }) => ({ slug, label }))];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = allServices.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-[31px] font-semibold tracking-tight">{service.label}</h1>
      <p className="mt-4 text-black/60">Liste des prestations à venir.</p>
    </section>
  );
}
